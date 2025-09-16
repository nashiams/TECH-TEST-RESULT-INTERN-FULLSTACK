const request = require("supertest");
const app = require("../app");
const pool = require("../db/pool");

describe("API Tests", () => {
  let userToken;
  let user2Token;
  let productId;

  beforeAll(async () => {
    // Clean database before tests
    await pool.query('DELETE FROM "Products"');
    await pool.query('DELETE FROM "Users"');
  });

  afterAll(async () => {
    // Clean up after tests
    await pool.end();
  });

  describe("Authentication Tests", () => {
    describe("POST /register", () => {
      test("should register a new user successfully", async () => {
        const response = await request(app).post("/register").send({
          username: "testuser",
          password: "testpassword",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("username", "testuser");
      });

      test("should register second user for authorization tests", async () => {
        const response = await request(app).post("/register").send({
          username: "testuser2",
          password: "testpassword2",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("username", "testuser2");
      });

      test("should fail to register user without username", async () => {
        const response = await request(app).post("/register").send({
          password: "testpassword",
        });

        expect(response.status).toBe(400);
      });

      test("should fail to register user without password", async () => {
        const response = await request(app).post("/register").send({
          username: "testuser",
        });

        expect(response.status).toBe(400);
      });
    });

    describe("POST /login", () => {
      test("should login user successfully", async () => {
        const response = await request(app).post("/login").send({
          username: "testuser",
          password: "testpassword",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
        userToken = response.body.access_token;
      });

      test("should login second user successfully", async () => {
        const response = await request(app).post("/login").send({
          username: "testuser2",
          password: "testpassword2",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("access_token");
        user2Token = response.body.access_token;
      });

      test("should fail to login with wrong password", async () => {
        const response = await request(app).post("/login").send({
          username: "testuser",
          password: "wrongpassword",
        });

        expect(response.status).toBe(401);
      });

      test("should fail to login with non-existent user", async () => {
        const response = await request(app).post("/login").send({
          username: "nonexistent",
          password: "testpassword",
        });

        expect(response.status).toBe(401);
      });
    });
  });

  describe("Product Tests", () => {
    describe("GET /products", () => {
      test("should get products with authentication", async () => {
        const response = await request(app)
          .get("/products")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("products");
        expect(response.body).toHaveProperty("pagination");
      });

      test("should fail to get products without authentication", async () => {
        const response = await request(app).get("/products");

        expect(response.status).toBe(401);
      });

      test("should get products with pagination", async () => {
        const response = await request(app)
          .get("/products?page=1&limit=5")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.pagination.currentPage).toBe(1);
        expect(response.body.pagination.limit).toBe(5);
      });
    });

    describe("POST /products", () => {
      test("should create a new product", async () => {
        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Test Product",
            description: "This is a test product",
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "Test Product");
        expect(response.body).toHaveProperty(
          "description",
          "This is a test product"
        );
        expect(response.body).toHaveProperty("image");
        productId = response.body.id;
      });

      test("should sanitize product name in image URL", async () => {
        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Test Product With Spaces!@#",
            description: "Product with special characters",
          });

        expect(response.status).toBe(201);
        expect(response.body.image).toContain("Test_Product_With_Spaces___");
      });

      test("should fail to create product without authentication", async () => {
        const response = await request(app).post("/products").send({
          name: "Test Product",
          description: "This is a test product",
        });

        expect(response.status).toBe(401);
      });

      test("should fail to create product without name", async () => {
        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            description: "This is a test product",
          });

        expect(response.status).toBe(400);
      });

      test("should fail to create product without description", async () => {
        const response = await request(app)
          .post("/products")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Test Product",
          });

        expect(response.status).toBe(400);
      });
    });

    describe("GET /products/:id", () => {
      test("should get a specific product", async () => {
        const response = await request(app)
          .get(`/products/${productId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id", productId);
        expect(response.body).toHaveProperty("name", "Test Product");
      });

      test("should fail to get non-existent product", async () => {
        const response = await request(app)
          .get("/products/9999")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(404);
      });

      test("should fail to get product without authentication", async () => {
        const response = await request(app).get(`/products/${productId}`);

        expect(response.status).toBe(401);
      });
    });

    describe("PUT /products/:id", () => {
      test("should update own product", async () => {
        const response = await request(app)
          .put(`/products/${productId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Updated Test Product",
            description: "This is an updated test product",
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "Updated Test Product");
        expect(response.body).toHaveProperty(
          "description",
          "This is an updated test product"
        );
      });

      test("should fail to update other user's product", async () => {
        const response = await request(app)
          .put(`/products/${productId}`)
          .set("Authorization", `Bearer ${user2Token}`)
          .send({
            name: "Unauthorized Update",
            description: "This should fail",
          });

        expect(response.status).toBe(403);
      });

      test("should fail to update without authentication", async () => {
        const response = await request(app).put(`/products/${productId}`).send({
          name: "Unauthorized Update",
          description: "This should fail",
        });

        expect(response.status).toBe(401);
      });

      test("should fail to update non-existent product", async () => {
        const response = await request(app)
          .put("/products/9999")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            name: "Non-existent Product",
            description: "This should fail",
          });

        expect(response.status).toBe(404);
      });
    });

    describe("DELETE /products/:id", () => {
      test("should fail to delete other user's product", async () => {
        const response = await request(app)
          .delete(`/products/${productId}`)
          .set("Authorization", `Bearer ${user2Token}`);

        expect(response.status).toBe(403);
      });

      test("should delete own product", async () => {
        const response = await request(app)
          .delete(`/products/${productId}`)
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "Product deleted successfully"
        );
      });

      test("should fail to delete non-existent product", async () => {
        const response = await request(app)
          .delete("/products/9999")
          .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(404);
      });

      test("should fail to delete without authentication", async () => {
        const response = await request(app).delete(`/products/${productId}`);

        expect(response.status).toBe(401);
      });
    });
  });
});

const pool = require("../db/pool");

class ProductController {
  static async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const countQuery = `SELECT COUNT(*) FROM "Products"`;
      const countResult = await pool.query(countQuery);
      const totalProducts = parseInt(countResult.rows[0].count);

      const query = `SELECT * FROM "Products" ORDER BY id LIMIT $1 OFFSET $2`;
      const result = await pool.query(query, [limit, offset]);

      const totalPages = Math.ceil(totalProducts / limit);

      res.status(200).json({
        products: result.rows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalProducts: totalProducts,
          limit: limit,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const query = `SELECT * FROM "Products" WHERE id = $1`;
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw { name: "NotFound", message: "Product not found" };
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        throw { name: "BadRequest", message: "Missing input fields" };
      }

      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
      const image =
        "https://pollinations.ai/p/photorealistic_image_of_" + sanitizedName;
      const userId = req.user.id;

      const query = `
            INSERT INTO "Products" (name, description, "userId", image)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
      const values = [name, description, userId, image];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name || !description) {
        throw { name: "BadRequest", message: "Missing input fields" };
      }

      const userId = req.user.id;
      const image =
        "https://pollinations.ai/p/photorealistic_image_of_" +
        name.replace(/[^a-zA-Z0-9]/g, "_");

      const query = `
            UPDATE "Products"       
            SET name = $1, description = $2, "userId" = $3, image = $4
            WHERE id = $5
            RETURNING *
        `;
      const values = [name, description, userId, image, id];
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        throw { name: "NotFound", message: "Product not found" };
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const query = `DELETE FROM "Products" WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, [id]);

      if (result.rowCount === 0) {
        throw { name: "NotFound", message: "Product not found" };
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = { ProductController };

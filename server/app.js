const express = require("express");
const { AuthController } = require("./controllers/authController");
const { authentic } = require("./middlewares/authentic");
const { authorization } = require("./middlewares/authorization");
const { ProductController } = require("./controllers/productController");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("cors");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["*"],
    credentials: false,
  })
);

app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

app.get("/products", authentic, ProductController.getProducts);
app.get("/products/:id", authentic, ProductController.getProductById);
app.post("/products", authentic, ProductController.createProduct);
app.put(
  "/products/:id",
  authentic,
  authorization,
  ProductController.updateProduct
);
app.delete(
  "/products/:id",
  authentic,
  authorization,
  ProductController.deleteProduct
);

app.use(errorHandler);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app;

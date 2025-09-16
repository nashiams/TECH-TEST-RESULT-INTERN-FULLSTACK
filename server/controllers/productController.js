const ProductService = require("../application/services/ProductService");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async getProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await this.productService.getProducts(page, limit);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await this.productService.getProductById(id);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const { name, description } = req.body;
      const userId = req.user.id;

      const result = await this.productService.createProduct({
        name,
        description,
        userId,
      });

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = req.user.id;

      const result = await this.productService.updateProduct({
        id,
        name,
        description,
        userId,
      });

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const result = await this.productService.deleteProduct(id);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

// Create a single instance to maintain state
const productControllerInstance = new ProductController();

module.exports = {
  ProductController: {
    getProducts: productControllerInstance.getProducts.bind(
      productControllerInstance
    ),
    getProductById: productControllerInstance.getProductById.bind(
      productControllerInstance
    ),
    createProduct: productControllerInstance.createProduct.bind(
      productControllerInstance
    ),
    updateProduct: productControllerInstance.updateProduct.bind(
      productControllerInstance
    ),
    deleteProduct: productControllerInstance.deleteProduct.bind(
      productControllerInstance
    ),
  },
};

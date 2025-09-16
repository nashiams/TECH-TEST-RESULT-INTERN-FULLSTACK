const ProductRepository = require("../../infrastructure/repositories/ProductRepository");
const GetProductsUseCase = require("../useCases/GetProductsUseCase");
const CreateProductUseCase = require("../useCases/CreateProductUseCase");
const UpdateProductUseCase = require("../useCases/UpdateProductUseCase");

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
    this.getProductsUseCase = new GetProductsUseCase(this.productRepository);
    this.createProductUseCase = new CreateProductUseCase(
      this.productRepository
    );
    this.updateProductUseCase = new UpdateProductUseCase(
      this.productRepository
    );
  }

  async getProducts(page, limit) {
    return await this.getProductsUseCase.execute(page, limit);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    return product ? product.toJSON() : null;
  }

  async createProduct({ name, description, userId }) {
    return await this.createProductUseCase.execute({
      name,
      description,
      userId,
    });
  }

  async updateProduct({ id, name, description, userId }) {
    return await this.updateProductUseCase.execute({
      id,
      name,
      description,
      userId,
    });
  }

  async deleteProduct(id) {
    await this.productRepository.delete(id);
    return { message: "Product deleted successfully" };
  }
}

module.exports = ProductService;

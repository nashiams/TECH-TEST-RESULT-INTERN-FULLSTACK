const Product = require("../../domain/entities/Product");

class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ name, description, userId }) {
    if (!name || !description) {
      throw { name: "BadRequest", message: "Missing input fields" };
    }

    const product = Product.create({ name, description, userId });
    const savedProduct = await this.productRepository.save(product);

    return savedProduct.toJSON();
  }
}

module.exports = CreateProductUseCase;

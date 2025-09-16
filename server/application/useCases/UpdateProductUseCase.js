class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ id, name, description, userId }) {
    if (!name || !description) {
      throw { name: "BadRequest", message: "Missing input fields" };
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw { name: "NotFound", message: "Product not found" };
    }

    if (!existingProduct.isOwnedBy(userId)) {
      throw {
        name: "Forbidden",
        message: "Not authorized to update this product",
      };
    }

    existingProduct.update({ name, description });
    const updatedProduct = await this.productRepository.update(
      id,
      existingProduct
    );

    return updatedProduct.toJSON();
  }
}

module.exports = UpdateProductUseCase;

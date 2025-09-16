const Pagination = require("../../domain/valueObjects/Pagination");

class GetProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(page, limit) {
    const pagination = Pagination.create(page, limit);
    const result = await this.productRepository.findAll(pagination);

    return {
      products: result.products.map((product) => product.toJSON()),
      pagination: pagination.toResponse(result.totalCount),
    };
  }
}

module.exports = GetProductsUseCase;

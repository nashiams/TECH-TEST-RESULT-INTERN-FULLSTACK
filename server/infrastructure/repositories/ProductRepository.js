const IProductRepository = require("../../domain/repositories/IProductRepository");
const Product = require("../../domain/entities/Product");
const ProductModel = require("../../models/productModels");

class ProductRepository extends IProductRepository {
  async findAll(pagination) {
    const result = await ProductModel.getProducts({
      page: pagination.page,
      limit: pagination.limit,
    });

    const products = result.products.map(
      (productData) => new Product(productData)
    );

    return {
      products,
      totalCount: result.pagination.totalProducts,
    };
  }

  async findById(id) {
    const productData = await ProductModel.getProductById(id);
    return productData ? new Product(productData) : null;
  }

  async save(product) {
    const productData = await ProductModel.createProduct({
      name: product.name,
      description: product.description,
      userId: product.userId,
      image: product.image,
    });
    return new Product(productData);
  }

  async update(id, product) {
    const productData = await ProductModel.updateProduct({
      id,
      name: product.name,
      description: product.description,
      userId: product.userId,
      image: product.image,
    });
    return new Product(productData);
  }

  async delete(id) {
    await ProductModel.deleteProduct(id);
    return true;
  }
}

module.exports = ProductRepository;

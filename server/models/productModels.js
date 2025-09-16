const pool = require("../db/pool");
const {
  getProductQuery,
  countPageQuery,
  getProductByIdQuery,
  createProductQuery,
  updateProductQuery,
  deleteProductQuery,
} = require("../sql/sql_product");

class ProductModel {
  static async getProducts({ page, limit }) {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(countPageQuery);
    const totalProducts = parseInt(countResult.rows[0].count);

    const result = await pool.query(getProductQuery, [limit, offset]);

    const totalPages = Math.ceil(totalProducts / limit);
    return {
      products: result.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
        limit: limit,
      },
    };
  }

  static async getProductById(id) {
    const result = await pool.query(getProductByIdQuery, [id]);

    if (result.rowCount === 0) {
      throw { name: "NotFound", message: "Product not found" };
    }

    return result.rows[0];
  }

  static async createProduct({ name, description, userId, image }) {
    const values = [name, description, userId, image];
    const result = await pool.query(createProductQuery, values);
    return result.rows[0];
  }

  static async updateProduct({ id, name, description, userId, image }) {
    const values = [name, description, userId, image, id];
    const result = await pool.query(updateProductQuery, values);

    if (result.rowCount === 0) {
      throw { name: "NotFound", message: "Product not found" };
    }

    return result.rows[0];
  }

  static async deleteProduct(id) {
    const result = await pool.query(deleteProductQuery, [id]);

    if (result.rowCount === 0) {
      throw { name: "NotFound", message: "Product not found" };
    }

    return result.rows[0];
  }
}

module.exports = ProductModel;

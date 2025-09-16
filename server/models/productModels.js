const pool = require("../db/pool");

class ProductModel {
  static async getProducts({ page, limit }) {
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM "Products"`;
    const countResult = await pool.query(countQuery);
    const totalProducts = parseInt(countResult.rows[0].count);

    const query = `SELECT * FROM "Products" ORDER BY id LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [limit, offset]);

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
}

module.exports = ProductModel;

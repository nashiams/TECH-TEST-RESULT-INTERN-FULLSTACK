const pool = require("../db/pool");

async function authorization(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const query = `SELECT * FROM "Products" WHERE id = $1`;
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw { name: "NotFound", message: "Product not found" };
    }

    const product = result.rows[0];

    if (product.userId !== userId) {
      throw {
        name: "Forbidden",
        message: "You are not authorized to access this product",
      };
    }

    req.product = product;
    next();
  } catch (error) {
    console.log("authorization middleware error:", error);
    next(error);
  }
}

module.exports = { authorization };

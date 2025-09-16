const pool = require("../db/pool");
const { verifyToken } = require("../helper/jwt");

async function authentic(req, res, next) {
  try {
    let { authorization } = req.headers;

    if (!authorization) {
      throw { name: "Unauthorized", message: "Missing token" };
    }

    let rawToken = authorization.split(" ");
    let tipeToken = rawToken[0];
    let token = rawToken[1];

    if (tipeToken !== "Bearer" || !token) {
      throw { name: "Unauthorized", message: "Invalid token format" };
    }

    let value = verifyToken(token);
    if (!value) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }
    const result = await pool.query(
      `SELECT id, username FROM "Users" WHERE id = $1`,
      [value.id]
    );

    if (result.rowCount === 0) {
      throw { name: "Unauthorized", message: "User not found" };
    }

    req.user = result.rows[0]; // attach user to request
    next();
  } catch (error) {
    console.log("auth middleware error:", error);
    next(error);
  }
}

module.exports = { authentic };

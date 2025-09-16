const pool = require("../db/pool");
const { hashPassword, comparePassword } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const { createNewUserQuery, searchingUserQuery } = require("../sql/sql_auth");

class UserModel {
  static async register({ username, password }) {
    if (!username || !password) {
      throw { name: "BadRequest", message: "Missing input fields" };
    }

    const hashedPassword = hashPassword(password);

    const query = createNewUserQuery;

    const values = [username, hashedPassword];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async login({ username, password }) {
    if (!username || !password) {
      throw { name: "BadRequest", message: "Username & password required" };
    }

    const query = searchingUserQuery;
    const result = await pool.query(query, [username]);

    const foundUser = result.rows[0];
    if (!foundUser) {
      throw { name: "Unauthorized", message: "Invalid username/password" };
    }

    const match = comparePassword(password, foundUser.password);
    if (!match) {
      throw { name: "Unauthorized", message: "Invalid username/password" };
    }

    const token = signToken({
      id: foundUser.id,
      username: foundUser.username,
    });
    return token;
  }

  static async findByUsername(username) {
    const query = searchingUserQuery;
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }
}

module.exports = UserModel;

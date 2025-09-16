const pool = require("../db/pool");
const { comparePassword, hashPassword } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");
const UserModel = require("../models/authModels");

class AuthController {
  static async Register(req, res, next) {
    try {
      let { username, password } = req.body;
      let result = await UserModel.register({ username, password });

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      let { username, password } = req.body;
      let token = await UserModel.login({ username, password });

      res.status(200).json({ access_token: token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;

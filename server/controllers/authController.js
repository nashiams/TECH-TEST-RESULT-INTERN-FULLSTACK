const AuthService = require("../application/services/AuthService");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async register(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await this.authService.register({ username, password });

      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login({ username, password });

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

// Create a single instance to maintain state
const authControllerInstance = new AuthController();

module.exports = {
  AuthController: {
    register: authControllerInstance.register.bind(authControllerInstance),
    login: authControllerInstance.login.bind(authControllerInstance),
  },
};

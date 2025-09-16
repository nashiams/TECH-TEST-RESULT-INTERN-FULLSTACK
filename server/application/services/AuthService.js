const RegisterUserUseCase = require("../usecases/RegisterUserUseCase");
const LoginUserUseCase = require("../usecases/LoginUserUseCase");
const UserRepositoryImpl = require("../../infrastructure/repositories/UserRepositoryImpl");

class AuthService {
  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.registerUserUseCase = new RegisterUserUseCase(this.userRepository);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);
  }

  async register(userData) {
    return await this.registerUserUseCase.execute(userData);
  }

  async login(credentials) {
    return await this.loginUserUseCase.execute(credentials);
  }
}

module.exports = AuthService;

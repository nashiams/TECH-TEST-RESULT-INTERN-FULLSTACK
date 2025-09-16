const User = require("../../domain/entities/User");

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    // Handle case where userData might be undefined or null
    if (!userData) {
      const error = new Error("Request body is required");
      error.status = 400;
      throw error;
    }

    const { username, password } = userData;

    // Domain validation - throw validation errors with proper status
    if (!username || username.trim() === "") {
      const error = new Error("Username is required");
      error.status = 400;
      throw error;
    }

    if (!password || password.trim() === "") {
      const error = new Error("Password is required");
      error.status = 400;
      throw error;
    }

    const user = User.create(username, password); // Remove hashPassword call here
    const result = await this.userRepository.create(user);

    return result;
  }
}

module.exports = RegisterUserUseCase;

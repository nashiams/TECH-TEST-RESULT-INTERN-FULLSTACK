const { comparePassword } = require("../../helper/bcrypt");
const { signToken } = require("../../helper/jwt");

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(credentials) {
    // Handle case where credentials might be undefined or null
    if (!credentials) {
      const error = new Error("Request body is required");
      error.status = 400;
      throw error;
    }

    const { username, password } = credentials;

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

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const isPasswordValid = comparePassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    // Generate token for authenticated user
    const token = signToken({ id: user.id, username: user.username });

    return { access_token: token };
  }
}

module.exports = LoginUserUseCase;

const UserRepository = require("../../domain/repositories/UserRepository");
const UserModel = require("../../models/authModels");
const User = require("../../domain/entities/User");

class UserRepositoryImpl extends UserRepository {
  async findByUsername(username) {
    // Implementation would depend on your UserModel structure
    const userData = await UserModel.findByUsername(username);
    if (!userData) return null;

    return new User(
      userData.id,
      userData.username,
      userData.password,
      userData.createdAt,
      userData.updatedAt
    );
  }

  async create(user) {
    const result = await UserModel.register({
      username: user.username,
      password: user.password,
    });
    return result;
  }

  async validateCredentials(username, password) {
    const token = await UserModel.login({ username, password });
    return token;
  }
}

module.exports = UserRepositoryImpl;

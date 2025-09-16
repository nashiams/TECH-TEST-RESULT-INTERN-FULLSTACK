class UserRepository {
  async findByUsername(username) {
    throw new Error("Method 'findByUsername' must be implemented");
  }

  async create(user) {
    throw new Error("Method 'create' must be implemented");
  }

  async validateCredentials(username, password) {
    throw new Error("Method 'validateCredentials' must be implemented");
  }
}

module.exports = UserRepository;

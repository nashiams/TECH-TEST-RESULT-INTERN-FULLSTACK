class User {
  constructor(
    id,
    username,
    password,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(username, password) {
    return new User(null, username, password);
  }
}

module.exports = User;

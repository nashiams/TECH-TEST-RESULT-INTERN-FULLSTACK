let bcrypt = require("bcryptjs");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}

module.exports = { hashPassword, comparePassword };

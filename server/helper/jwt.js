let jwt = require("jsonwebtoken");

function signToken(token1) {
  let token = jwt.sign(token1, "shhhhh");
  return token;
}

function verifyToken(token1) {
  var decoded = jwt.verify(token1, "shhhhh");
  return decoded;
}

module.exports = { signToken, verifyToken };

const jwt = require("jsonwebtoken");

module.exports.createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

module.exports.createUser = async ({ username, password, email }) => {
  console.log("Add User: ", username, password, email);
  console.log(checkUsername(username));
  return;
};

module.exports.checkUsername = async ({ username }) => {
  username === "jill" ? "This username already exists, please try again" : null;
};

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
  let result = await this.checkUsername(username);
  console.log("result: ", await result);
  if (result !== null) return result;
  return "Username approved";
};

module.exports.checkUsername = username => {
  if (username === "jill") {
    //Database stuff !?!?!?!

    return "This username already exists, please try again";
  } else {
    return null;
  }
};

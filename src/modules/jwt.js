const config = require("../config/serverSettings");
const jwt = require("jsonwebtoken");
const tempSecret = config.secret;

module.exports.extractToken = async token => {
  //   console.log("Verifying Auth Token is this file savedwait what the ", token);
  let checkToken = null;
  try {
    return (checkToken = await new Promise((resolve, reject) => {
      jwt.verify(token, tempSecret, "HS256", (err, res) => {
        if (token) console.log("JWT Verified");
        if (err) return reject(err);
        return resolve(res);
      });
    }));
  } catch (err) {
    let reason = {
      error: "problem creating token from user"
    };
    Promise.reject(reason);
    console.log(reason);
    return null;
  }
};

module.exports.createAuthToken = user => {
  //   console.log("Create Auth Token: ", user);
  const { id } = user;
  return jwt.sign({ id: id }, tempSecret, {
    subject: "",
    expiresIn: "30d",
    algorithm: "HS256"
  });
};

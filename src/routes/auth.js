const { authUser } = require("../models/user");

const auth = async (req, res, next) => {
  const header = req.headers["authorization"];
  console.log("API AUTH: ", header);

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;

    req.user = await authUser(token);
    if (!req.user) {
      return res.json({ error: "Invalid Authorization" });
    } else {
      next();
    }
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};

module.exports = auth;

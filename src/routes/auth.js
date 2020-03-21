const { authUserData } = require("../models/user");
const { authRobotData } = require("../models/robot");
const { extractToken } = require("../modules/jwt");

const { logger } = require("../modules/logging");
const log = message => {
  logger({
    message: message,
    level: "debug",
    source: "routes/auth.js"
  });
};

const auth = options => {
  // console.log(options);
  return async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        //parse token as a first step
        const bearer = req.headers["authorization"].split(" ");
        const token = bearer[1];
        const tokenData = await extractToken(token);
        // console.log("////////////CHECK TOKEN DATA///////////", tokenData);
        if (tokenData && tokenData.id) {
          let type = tokenData.id.substring(0, 4);

          // console.log("API AUTH: ", tokenData);
          if (type === "user" && options.user) {
            req.user = await authUserData(tokenData);
          } else if (type === "rbot" && options.robot) {
            //log(`API AUTH ROBOT: ${req.robot.name}`);
            // console.log(req.robot, req.body);
            req.robot = await authRobotData(tokenData);
            // console.log("AUTH ROBOT: ", req.robot, req.body);
          }
        }
      } else {
        return res.json({ error: "Invalid Authorization" });
      }
      next();
    } catch (e) {
      console.log("Failed Authentication");
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = auth;

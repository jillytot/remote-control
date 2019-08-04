// const { authUser } = require("../models/user");

// const auth = async (req, res, next) => {
//   try {
//     const header = req.headers["authorization"];
//     console.log("API AUTH: ", header);

//     if (typeof header !== "undefined") {
//       const bearer = header.split(" ");
//       const token = bearer[1];
//       req.token = token;

//       req.user = await authUser(token);
//       if (!req.user) {
//         return res.json({ error: "Invalid Authorization" });
//       } else {
//         next();
//       }
//     } else {
//       //If header is undefined return Forbidden (403)
//       res.sendStatus(403);
//     }
//   } catch (e) {
//     console.error("Auth Middleware Error: ", e);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = auth;

const { authUserData } = require("../models/user");
const { authRobotData } = require("../models/robot");
const { extractToken } = require("../modules/jwt");

const auth = options => {
  // console.log(options);
  return async (req, res, next) => {
    try {
      //parse token as a first step
      const bearer = req.headers["authorization"].split(" ");
      const token = bearer[1];
      const tokenData = await extractToken(token);
      console.log("////////////CHECK TOKEN DATA///////////", tokenData);
      let type = tokenData.id.substring(0, 4);

      console.log("API AUTH: ", tokenData);
      if (type === "user" && options.user) {
        //what
        req.user = await authUserData(tokenData);
      } else if (type === "rbot" && options.robot) {
        //e you need t
        req.robot = await authRobotData(tokenData);
      } else {
        return res.json({ error: "Invalid Authorization" });
      }
      next();
    } catch (e) {
      console.error("Auth Middleware Error: ", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = auth;

const router = require("express").Router();
const request = require("./../modules/requests");

//example route: router.use(/route, require('./path-to-route'));
router.use("/users", require("./users"));
router.use("/login", require("./login"));

//test API
router.get("/", (req, res) => res.send("API Test!"));
router.get("/ip", (req, res) => {
  //Test for proxy
  res.status(200).json({ ip: request.ip(req) });
});

module.exports = router;

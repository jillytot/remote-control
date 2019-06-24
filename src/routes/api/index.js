const router = require("express").Router();
const request = require("../../modules/requests");

//example route: router.use(/route, require('./path-to-route'));
router.use("/signup", require("./signup"));
router.use("/login", require("./login"));
router.use("/auth", require("./auth"));
router.use("/robot-server", require("./robotServer"));
router.use("/robot", require("./setupRobot"));
router.use("/channels", require("./channels"));
router.use("/controls", require("./controls"));

//test API
router.get("/", (req, res) => {
  const displayRoutes = {
    signup: "/signup",
    login: "/login",
    auth: "/auth"
  };
  res.send(displayRoutes);
});

router.get("/ip", (req, res) => {
  //Test for proxy
  res.status(200).json({ ip: request.ip(req) });
});

module.exports = router;

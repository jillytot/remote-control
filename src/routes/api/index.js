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
router.use("/stats", require("./stats"));
router.use("/user", require("./user"));
router.use("/chat", require("./chat"));
router.use("/moderation", require("./moderation"));
router.use("/integrations", require("./integrations"));

//test API
router.get("/", (req, res) => {
  const displayRoutes = {
    signup: "/signup",
    login: "/login",
    auth: "/auth"
  };
  res.send(displayRoutes);
});

router.get("/ip", async (req, res) => {
  //Test for proxy
  res.status(200).json({ ip: await request.ip(req) });
});

module.exports = router;

const router = require("express").Router();
const request = require("../../modules/requests");

//example route: router.use(/route, require('./path-to-route'));
router.use("/users", require("./users"));
router.use("/signup", require("./signup"));
router.use("/login", require("./login"));
router.use("/auth", require("./auth"));

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

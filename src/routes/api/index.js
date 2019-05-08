const router = require("express").Router();

//example route: router.use(/route, require('./path-to-route'));
router.use("/users", require("./users"));

//test API
router.get("/", (req, res) => res.send("API Test!"));

module.exports = router;

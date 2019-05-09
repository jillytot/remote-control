const router = require("express").Router();

router.get("/", (req, res) => {
  return res.send({ login: "login" });
});

router.post("/", (req, res) => {
  // post request
});

module.exports = router;

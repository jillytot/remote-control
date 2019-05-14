const router = require("express").Router();
const user = require("../../models/user");

router.post("/", async (req, res) => {
  // post request
  const checkPassword = await user.checkPassword(req.body);

  checkPassword ? res.send("ok") : res.send("not ok");
});

module.exports = router;

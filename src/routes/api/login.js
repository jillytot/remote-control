const router = require("express").Router();
const user = require("../../models/user");

router.post("/", async (req, res) => {
  // post request
  const checkPassword = await user.checkPassword(req.body);

  //TODO: Edge Cases for successfull login, but user has no / expired token.

  checkPassword
    ? res.send("Password Correct") //Authenticate / Re-Authenticate User
    : res.send("Login Incorrect, please try again");
});

module.exports = router;

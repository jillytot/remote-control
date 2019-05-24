const router = require("express").Router();
const user = require("../../models/user");

router.get("/", async (req, res) => {
  return res.send("Login");
});

router.post("/", async (req, res) => {
  // post request
  console.log("Login: ", req.body);
  const verify = await user.checkPassword(req.body);
  console.log("Check Password Result: ", verify);
  //TODO: Edge Cases for successfull login, but user has no / expired token.

  verify.password
    ? res.send(verify) //Authenticate / Re-Authenticate User
    : res.send("Login Incorrect, please try again");

  if (verify.password) console.log("User has logged in: ", verify.username);
});

module.exports = router;

const router = require("express").Router();
const user = require("../../models/user");

router.get("/", async (req, res) => {
  response = {
    username: "required",
    password: "required"
  };
  return res.send(response);
});

router.post("/", async (req, res) => {
  // post request
  if (req.body && req.body.username)
    console.log("Login Username: ", req.body.username);
  const verify = await user.checkPassword(req.body);
  if (verify && verify.password)
    console.log("Check Password Result: ", verify.password);
  //TODO: Edge Cases for successfull login, but user has no / expired token.

  verify.password
    ? res.send(verify) //Authenticate / Re-Authenticate User
    : res.send("Login Incorrect, please try again");

  if (verify.password) console.log("User has logged in: ", verify.username);
});

module.exports = router;

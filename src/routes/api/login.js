const router = require("express").Router();
const { jsonError } = require("../../modules/logging");

router.get("/", async (req, res) => {
  response = {
    username: "required",
    password: "required"
  };
  return res.send(response);
});

router.post("/", async (req, res) => {
  const { checkPassword } = require("../../models/user");
  const { checkUsername } = require("../../controllers/user");
  const loginError =
    "Login Incorrect, please try a different username or password";
  // post request
  if (req.body && req.body.username) {
    console.log("Check Username: ", req.body.username);
    const checkUser = await checkUsername(req.body.username);
    if (!checkUser) {
      res.send(jsonError(loginError));
      return;
    }
  }

  const verify = await checkPassword(req.body);
  if (verify && verify.password)
    // console.log("Check Password Result: ", verify.password);
    //TODO: Edge Cases for successfull login, but user has no / expired token.

    verify.password
      ? res.send(verify) //Authenticate / Re-Authenticate User
      : res.send(jsonError(loginError));

  if (verify.password) console.log("User has logged in: ", verify.username);
});

module.exports = router;

const router = require("express").Router();
const user = require("../../models/user");

router.get("/", (req, res) => {
  return res.send({ login: "login" });
});

router.post("/", async (req, res) => {
  const { username, password, email } = req.query;
  // post request
  console.log("Login Req: ", username, password, email);
  const createUser = await user.createUser(req.query);
  createUser !== null ? res.send(createUser) : res.send("ok");
});

module.exports = router;

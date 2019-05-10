const router = require("express").Router();
const user = require("../../models/user");
const uuidv4 = require("uuid/v4");

router.get("/", (req, res) => {
  return res.send({ login: "login" });
});

router.post("/", async (req, res) => {
  // post request
  req.body.id = uuidv4();
  const createUser = await user.createUser(req.body);
  createUser !== null ? res.send(createUser) : res.send("ok");
});

module.exports = router;

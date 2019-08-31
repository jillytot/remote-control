const router = require("express").Router();
const auth = require("../auth");
const { err } = require("../../modules/utilities");

router.get("/followed", auth({ user: true }), async (req, res) => {
  const { followedServers } = require("../../controllers/user");
  console.log("Checking Followed Servers: ", req.user.username);
  if (req.user && req.user.id) {
    const followed = await followedServers(req.user);
    res.send(followed);
    return;
  }
  res.send({ status: "Error!", error: "Unable to get followed servers." });
  return;
});

//Will need to get user email, and this probably shouldn't need auth
router.post("/get-password-reset", auth({ user: true }), async (req, res) => {
  const { generateResetKey } = require("../../controllers/user");
  //req.body.email || req.body.username
  if (req.user && req.user.id) {
    console.log(`Reset Password for: ${req.user.username}`);
    const reset = await generateResetKey(req.user);
    res.send(reset);
    return;
  }
  res.send(err("There was a problem generating a reset key through the API"));
});

router.post("/password-reset", async (req, res) => {
  console.log("PASSWORD RESET");
  const { useResetKey } = require("../../controllers/user");
  if (req.body && req.body.key_id && req.body.password) {
    // console.log("PASSWORD RESET CHECK: ", req.body);
    const reset = await useResetKey({
      key_id: req.body.key_id,
      password: req.body.password
    });
    if (reset) {
      res.send(reset);
      return;
    }
  }
  res.send(err("There was a problem with resetting your password"));
});

module.exports = router;

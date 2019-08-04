const router = require("express").Router();
const auth = require("../auth");

router.get("/followed", auth({ user: true }), async (req, res) => {
  const { followedServers } = require("../../controllers/user");
  console.log(req.user);
  if (req.user && req.user.id) {
    const followed = await followedServers(req.user);
    res.send(followed);
    return;
  }
  res.send({ status: "Error!", error: "Unable to get followed servers." });
  return;
});

module.exports = router;

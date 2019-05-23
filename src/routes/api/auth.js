const router = require("express").Router();
const { verifyAuthToken } = require("../../models/user");

router.post("/", async (req, res) => {
  try {
    const getUser = await verifyAuthToken(req.body.token);

    if (getUser) {
      console.log("API/AUTH: Verify User: ", getUser.id);
      let formatUser = {
        username: getUser.username,
        id: getUser.id
      };
      res.send(formatUser);
    } else {
      res.send({ error: "Authentication Failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

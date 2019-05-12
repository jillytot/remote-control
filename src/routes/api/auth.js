const router = require("express").Router();
const { verifyAuthToken } = require("../../models/user");

router.post("/", async (req, res) => {
  console.log("from Auth: ", req.body.token);
  const getUser = await verifyAuthToken(req.body.token);
  if (getUser !== null && getUser !== undefined) {
    // console.log("verification complete!", getUser);
    res.send(getUser);
  } else {
    res.send("api/auth: Unable to get user");
  }
});

module.exports = router;

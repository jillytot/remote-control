const router = require("express").Router();
const { verifyAuthToken, setUser } = require("../../models/user");

router.post("/", async (req, res) => {
  //console.log("from Auth: ", req.body.token);
  const getUser = await verifyAuthToken(req.body.token);
  if (getUser !== null && getUser !== undefined) {
    // console.log("verification complete!", getUser);
    let formatUser = {
      username: getUser.username,
      id: getUser.id
    };
    setUser(formatUser);
    res.send(formatUser);
  } else {
    res.send("api/auth: Unable to get user");
  }
});

module.exports = router;

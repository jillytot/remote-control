const router = require("express").Router();
const { authUser } = require("../../models/user");

router.get("/", async (req, res) => {
  console.log(req.headers.token);

  response = {
    token: "required"
  };

  return res.send(response);
});

router.post("/", async (req, res) => {
  try {
    let getUser = await authUser(req.body.token);

    if (getUser) {
      console.log("API/AUTH: Verify User: ", getUser.id);
      let formatUser = {
        user: {
          username: getUser.username,
          id: getUser.id,
          status: getUser.status
        }
      };
      res.send(formatUser);
    } else {
      res.send({ error: "Authentication Failed", user: null });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

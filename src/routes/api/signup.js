const axios = require("axios");
const router = require("express").Router();
const user = require("../../models/user");
const serverSettings = require("../../config/serverSettings");

router.post("/", async (req, res) => {
  // post request
  console.log(">>>>>> REQ", req.body);
  axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${serverSettings.reCaptchaSecretKey}&response=${req.body.response}`,
      {}
    )
    .then(async resp => {
      console.log("RECAPTCHA ", resp.data);
      const createUser = await user.createUser(req.body);
      createUser !== null ? res.send(createUser) : res.send("ok");
    })
    .catch(err => {
      console.error(`${err.response.status} at ${err.response.config.url}`);
    });
});

module.exports = router;

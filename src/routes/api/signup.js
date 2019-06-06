const axios = require("axios");
const router = require("express").Router();
const user = require("../../models/user");
const serverSettings = require("../../config/serverSettings");

router.post("/", async (req, res) => {
  // post request
  try {
    const captcha = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${
        serverSettings.reCaptchaSecretKey
      }&response=${req.body.response}`
    );
    delete req.body.response;
    console.log(captcha.data);
    if (captcha.data.success) {
      console.log("got here");
      const createUser = await user.createUser(req.body);
      console.log("and here");
      createUser !== null ? res.send(createUser) : res.send("ok");
      console.log("here too");
    } else {
      console.error("Captcha failed!")
    }
  } catch (err) {
    console.error(`${err.response.status} at ${err.response.config.url}`);
  }
});

module.exports = router;

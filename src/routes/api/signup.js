const axios = require("axios");
const router = require("express").Router();
const user = require("../../models/user");
const serverSettings = require("../../config/server");

router.post("/", async (req, res) => {
  // post request
  try {
    const captcha = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${
        serverSettings.reCaptchaSecretKey
      }&response=${req.body.response}`
    );
    delete req.body.response;
    if (captcha.data.success) {
      const createUser = await user.createUser(req.body);
      createUser !== null ? res.send(createUser) : res.send("ok");
    } else {
      console.error("Captcha failed!");
      res.send({
        status: "failed",
        error: "Unable to validate Captcha, please reload and try again"
      });
    }
  } catch (err) {
    res.send({
      status: "error",
      error: `${err.response.status} at ${err.response.config.url}`
    });
    console.error(`${err.response.status} at ${err.response.config.url}`);
  }
});

module.exports = router;

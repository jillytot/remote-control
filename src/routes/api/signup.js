const axios = require("axios");
const router = require("express").Router();
const user = require("../../models/user");
const serverSettings = require("../../config/server");
const { jsonError } = require("../../modules/logging");

router.post("/", async (req, res) => {
  const {
    validateUserName,
    validateUserEmail
  } = require("../../controllers/validate");
  // post request
  try {
    const captcha = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${serverSettings.reCaptchaSecretKey}&response=${req.body.response}`
    );
    delete req.body.response;
    if (captcha.data.success) {
      //Validate
      let data = req.body;
      data.username = validateUserName(data.username);
      if (data.username.error) return res.send(data.username);
      data.email = validateUserEmail(data.email);
      if (data.email.error) return res.send(data.email);

      //Create User
      const createUser = await user.createUser(data);
      createUser !== null ? res.send(createUser) : res.send("ok");
      return;
    } else {
      console.error("Captcha failed!");
      res.send(
        jsonError("Unable to validate capture, please reload and try again.")
      );
      return;
    }
  } catch (err) {
    // res.send(jsonError(`${err.response.status} at ${err.response.config.url}`));
    // console.error(`${err.response.status} at ${err.response.config.url}`);
    console.log(err);
    res.send(jsonError("There wasa problem creating an account."));
  }
});

module.exports = router;

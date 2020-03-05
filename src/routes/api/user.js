const router = require("express").Router();
const auth = require("../auth");
const { err } = require("../../modules/utilities");
const { jsonError } = require("../../modules/logging");

router.get("/followed", auth({ user: true }), async (req, res) => {
  const { followedServers } = require("../../controllers/user");

  if (req.user && req.user.id) {
    console.log("Checking Followed Servers: ", req.user.username);
    const followed = await followedServers(req.user);
    res.send(followed);
    return;
  }
  res.send({ status: "Error!", error: "Unable to get followed servers." });
  return;
});

router.post("/request-password-reset", async (req, res) => {
  const { emailResetToken } = require("../../controllers/user");
  const { addUser, addIp } = require("../../controllers/cooldown");
  const { ip } = require("../../modules/requests");
  if (req.body.username) {
    const checkUser = await addUser(req.body.username);
    const checkIp = await addIp(ip(req));

    if (checkUser || checkIp) {
      res.send(
        jsonError(
          "You are making too many requests, please wait a few minutes and try again."
        )
      );
      return;
    }
    res.send(await emailResetToken(req.body.username));
    return;
    //Get User
  }
  return res.status(400).json({ error: "Username is required." });
});

//Will need to get user email, and this probably shouldn't need auth
router.post("/get-password-reset", auth({ user: true }), async (req, res) => {
  const { generateResetKey } = require("../../controllers/user");
  if (req.user && req.user.id) {
    let emailKey = false;
    if (req.body.emailKey) emailKey = true;
    console.log(`Reset Password for: ${req.user.username}`);
    const reset = await generateResetKey(req.user, req.body.expires, emailKey);
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

//TODO: Throttle random URL checking to mine potential keys from DB
router.post("/validate-key", async (req, res) => {
  const { validateResetKey } = require("../../controllers/user");
  let response = {};
  if (req.body.key_id) {
    console.log("validate pasword reset key: ", req.body.key_id);
    const check = await validateResetKey({ key_id: req.body.key_id });
    response = check;
  } else {
    response.error =
      "This key is not valid, either it doesn't exist, or it could have expired. Please request a new password reset";
  }
  res.send(response);
});

router.post("/profile", auth({ user: true }), async (req, res) => {
  const { fetchProfileInfo } = require("../../controllers/user");
  const info = await fetchProfileInfo(req.user.id);
  res.send(info);
});

router.post("/update-email", auth({ user: true }), async (req, res) => {
  const { updateEmail } = require("../../controllers/user");
  let { email } = req.body;

  if (email) {
    const update = await updateEmail({ email: email, id: req.user.id });
    res.send(update);
    return;
  }
  res.send(jsonError("Invalid email"));
  return;
});
module.exports = router;

/**
 * Input:
 *    User Object: { user }
 *    Set Expiration ( Optional ): int ( in milliseconds )
 *
 * Response Success: { result: "Response Message" }
 * Response Error: { error: "Error message!" }
 */
router.post("/validate-email", auth({ user: true }), async (req, res) => {
  const { validateEmail } = require("../../controllers/validateEmail");
  if (!req.user) return jsonError("User required");
  const { expire } = req.body || null;
  console.log("REQUEST EMAIL VALIDATION...");
  const validate = await validateEmail(req.user, expire);
  res.send(validate);
});

/**
 * Input: ( No Auth Required )
 *  key_id: < string >
 *
 * Response Success: { email_verified: true }
 * Response Error: { error: "Error Message." }
 */
router.post("/validate-email-with-key", async (req, res) => {
  const { useEmailValidationKey } = require("../../controllers/validateEmail");
  const { key_id } = req.body;
  if (key_id) {
    const validate = await useEmailValidationKey(key_id);
    if (validate) return res.send(validate);
  } else {
    res.send(jsonError("key_id is required"));
    return;
  }
  res.send(
    jsonError(
      "Something went wrong during the validation process. Please try again later."
    )
  );
});

/**
 * Input: { user object }
 * Auth: Required
 *
 * Response Success: "OK".
 * Response Error: N/A
 */
router.post("/welcome", auth({ user: true }), async (req, res) => {
  const { setWelcomeFalse } = require("../../controllers/users/welcome");
  if (req.user) setWelcomeFalse(req.user);
  res.send("OK.");
});

/**
 * Input: settings {
 *    enable_email_notifications: ( boolean ) }
 *
 * Response Success: { user.settings object }
 * Response Error: { error: "error message" }
 */

router.post("/update-settings", auth({ user: true }), async (req, res) => {
  const { updateUserSettings } = require("../../controllers/user");
  const { settings } = req.body;
  if (!settings) return jsonError("settings required.");
  const user = req.user;
  user.settings = settings;
  const update = await updateUserSettings(user);
  return res.send(update);
});

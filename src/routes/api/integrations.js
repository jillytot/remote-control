const router = require("express").Router();
const { patreonClientID, patreonClientSecret } = require("../../config/server");
const { jsonError } = require("../../modules/logging");
const auth = require("../auth");

router.post("/patreon", auth({ user: true }), async (req, res) => {
  //   const { handleOAuthRedirectRequest } = require("../../modules/patreon");
  const body = {
    code: req.body.code,
    grant_type: "authorization_code",
    client_id: patreonClientID,
    client_secret: patreonClientSecret,
    redirect_uri: req.body.redirect_uri
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  console.log("///////PATREON DATA////////: ", body, headers);
  res.send(body.code);
});

module.exports = router;

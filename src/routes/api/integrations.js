const router = require("express").Router();
const { urlPrefix } = require("../../config/server");
const { jsonError } = require("../../modules/logging");
const auth = require("../auth");

router.post("/patreon", auth({ user: true }), async (req, res) => {
  const { linkPatron } = require("../../controllers/patreon");
  const { code, redirect_uri } = req.body;
  const uri = `${urlPrefix}patreon`;
  if (code && uri) {
    console.log("Link Patron Input: ", code, uri);
    const link = await linkPatron(req.body.code, uri);
    console.log("/////LINK RESULT: ", link);
  }

  // const body = {
  //   code: req.body.code,
  //   grant_type: "authorization_code",
  //   client_id: patreonClientID,
  //   client_secret: patreonClientSecret,
  //   redirect_uri: req.body.redirect_uri
  // };
  // const headers = {
  //   "Content-Type": "application/x-www-form-urlencoded"
  // };

  // console.log("///////PATREON DATA////////: ", body, headers);
  // res.send(body.code);
});

module.exports = router;

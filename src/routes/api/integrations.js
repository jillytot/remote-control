const router = require("express").Router();
const { urlPrefix } = require("../../config/server");
// const { jsonError } = require("../../modules/logging");
const auth = require("../auth");

router.post("/patreon", auth({ user: true }), async (req, res) => {
  const { linkPatron } = require("../../controllers/patreon");
  const { code, redirect_uri } = req.body;
  const uri = `${urlPrefix}patreon`;
  if (code && uri) {
    // console.log("Link Patron Input: ", code, uri);
    const link = await linkPatron(req.body.code, uri, req.user);
    console.log("/////LINK RESULT: ", link);
    res.send(link);
    return;
  }
});

module.exports = router;

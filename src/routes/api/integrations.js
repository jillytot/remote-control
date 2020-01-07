const router = require("express").Router();
const { urlPrefix } = require("../../config/server");
const auth = require("../auth");

/**
 * External service integration management from client
 */

/**
 * Input Required:
 *  code: <string>
 *  redirect_uri: <string> Currently Unused
 *  user: { user Object }
 *
 * Response Success: Object containing { patreon_id: <string> }
 * Response Error: { error: "error message." }
 */
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

/**
 * Input Required: user_id <string>
 * Response Success: <string>
 * Response Error: { error: "error message." }
 */
router.post("/patreon-remove", auth({ user: true }), async (req, res) => {
  const { removePatreon } = require("../../controllers/patreon");
  console.log("Removing Patreon Link...");
  const remove = await removePatreon(req.user.id);
  console.log("Remove Patreon Link Result: ", remove);
  return res.send(remove);
});

module.exports = router;

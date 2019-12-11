const router = require("express").Router();
const { jsonError } = require("../../modules/logging");
const auth = require("../auth");

router.post("/kick", auth({ user: true }), async (req, res) => {
  const { member, server_id } = req.body;
  const { kickMember } = require("../../controllers/moderation");
  console.log("KICKING MEMBER THROUGH API");
  if (member && server_id) {
    const kick = await kickMember({
      message: `/kick ${member.username}`,
      sender: req.user.username,
      sender_id: req.user.id,
      chat_id: null, //TODO: handle no chat option
      server_id: server_id,
      id: null,
      time_stamp: null,
      broadcast: "self",
      channel_id: null,
      display_message: false,
      badges: [],
      type: null
    });

    if (!kick.error) {
      res.send(kick);
      return;
    }
  }
  res.send(jsonError("Unable to kick user."));
});

module.exports = router;

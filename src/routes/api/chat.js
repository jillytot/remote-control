const router = require("express").Router();
const auth = require("../auth");

router.get("/messages", auth, async (req, res) => {
  const { getRecentChatMessages } = require("../../controllers/chatMessages");
  if (req.body && req.body.chat_id) {
    const getMessages = await getRecentChatMessages(req.body.chat_id);
    res.send(getMessages);
    return;
  }
  res.send({
    status: "error!",
    error: "Could not find any recent chat messages"
  });
});
module.exports = router;

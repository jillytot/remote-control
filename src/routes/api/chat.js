const router = require("express").Router();
const auth = require("../auth");

router.get("/messages", auth({ user: true }), async (req, res) => {
  const { loadChat } = require("../../controllers/chat");
  if (req.body && req.body.chat_id) {
    const getMessages = await loadChat(req.body.chat_id);
    res.send(getMessages);
    return;
  }
  res.send({
    status: "error!",
    error: "Could not find any recent chat messages"
  });
});
module.exports = router;

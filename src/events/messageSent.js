module.exports = async (ws, message) => {
  const { messageHandler } = require("../controllers/chatMessages");
  messageHandler(ws, message);
  return;
};

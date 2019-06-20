const { createMessage } = require("../models/chatMessage");

module.exports = (ws, message) => {
  console.log("Message Received: ", message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;
  createMessage(message);
};

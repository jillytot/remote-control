const { createMessage } = require("../models/chatMessage");

module.exports = async (ws, message) => {
  console.log("Message Received: ", message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;

  //check for timeouts

  const { getUserInfoFromId } = require("../models/user");
  const checkStatus = await getUserInfoFromId(message.userId);
  if (!checkStatus.status.timeout) {
    createMessage(message);
  }

  console.log("WS: ", ws);
  console.log("User is timedout, and cannot emmit this message");
};

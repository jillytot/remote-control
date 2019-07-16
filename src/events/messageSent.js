const { createMessage } = require("../models/chatMessage");

module.exports = async (ws, message) => {
  console.log("Message Received: ", ws.user, message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;

  //check for timeouts

  const { getUserInfoFromId, publicUser } = require("../models/user");
  const checkStatus = await getUserInfoFromId(ws.user.id); //This user info call is the single source of truth for the message sender
  message.user = publicUser(checkStatus);
  if (!checkStatus.status.timeout && !ws.user.status.timeout) {
    createMessage(message);
    return;
  }
  message.message = "You are in timeout, and cannot send anymore messages";
  message.type = "moderation";
  message.broadcast = "self";
  createMessage(message);
};

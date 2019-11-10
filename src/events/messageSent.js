const { createMessage } = require("../models/chatMessage");
const { getMember } = require("../models/serverMembers");

module.exports = async (ws, message) => {
  const wss = require("../services/wss");
  console.log("Message Received: ", ws.user, message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;

  //check for timeouts

  const { getUserInfoFromId, publicUser } = require("../models/user");
  const checkStatus = await getUserInfoFromId(ws.user.id); //This user info call is the single source of truth for the message sender
  message.user = publicUser(checkStatus);
  const getLocalStatus = await getMember({
    user_id: ws.user.id,
    server_id: message.server_id
  });
  if (!checkStatus.status.timeout && !getLocalStatus.status.timeout) {
    createMessage(message);
    wss.emitInternalEvent('chatMessage', {ip: ws.ip, ...message})
    return;
  }
  message.message = "You are in timeout, and cannot send anymore messages";
  message.type = "moderation";
  message.broadcast = "self";
  createMessage(message);
};

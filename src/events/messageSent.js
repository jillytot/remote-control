const { createMessage } = require("../models/chatMessage");
const { getMember } = require("../models/serverMembers");

module.exports = async (ws, message) => {
  const wss = require("../services/wss");
  console.log("Message Received: ", ws.user, message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;

  //check for timeouts

  const { publicUser } = require("../models/user");
  message.user = publicUser(ws.user);
  const getLocalStatus = await getMember({
    user_id: ws.user.id,
    server_id: message.server_id
  });

  const globalExpire = ws.user.status.expireTimeout || 0;
  const localExpire = getLocalStatus.status.expireTimeout || 0;

  console.log("STATUS CHECK: ", globalExpire, localExpire);
  if (globalExpire > Date.now() || localExpire > Date.now()) {
    message.message = "You are in timeout, and cannot send anymore messages";
    message.type = "moderation";
    message.broadcast = "self";
    createMessage(message);
    return;
  }
  createMessage(message);
  wss.emitInternalEvent("chatMessage", { ip: ws.ip, ...message });
  return;
};

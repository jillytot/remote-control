module.exports.messageHandler = async (ws, message) => {
  const { createMessage } = require("../models/chatMessage");
  const { getMember } = require("../models/serverMembers");
  const wss = require("../services/wss");

  console.log("Message Received: ", ws.user, message);
  if (ws.user && ws.user.type) message.userType = ws.user.type;

  //check for timeouts
  const { publicUser, getUserInfoFromId } = require("../models/user");
  const checkStatus = await getUserInfoFromId(ws.user.id);
  message.user = publicUser(checkStatus);
  const getLocalStatus = await getMember({
    user_id: ws.user.id,
    server_id: message.server_id
  });

  const globalExpire = parseInt(checkStatus.status.expireTimeout) || 0;
  const localExpire = getLocalStatus.status.expireTimeout || 0;

  console.log("STATUS CHECK: ", globalExpire, localExpire, Date.now());
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

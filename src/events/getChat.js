const { SEND_CHAT } = require("./definitions");
// const { getChat } = require("../models/chatRoom");
const { loadChat } = require("../controllers/chat");

module.exports = async (ws, chatId) => {
  console.log("GET CHAT Chat Id: ", chatId);
  ws.emitEvent(SEND_CHAT, await loadChat(chatId));

  //Subscribe user to chat
  ws.chat_id = chatId;
  if (ws.user) {
    console.log(`Subbing user: ${ws.user.username} to chatroom: ${chatId}`);
  } else if (ws.robot) {
    console.log(`Subbing robot: ${ws.robot.id} to chatroom: ${chatId}`);
  }
};

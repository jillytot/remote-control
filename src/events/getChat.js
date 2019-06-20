const { SEND_CHAT } = require("./definitions");

module.exports = async (ws, chatId) => {
  console.log("GET CHAT Chat Id: ", chatId);
  ws.emitEvent(SEND_CHAT, await getChat(chatId));

  //Subscribe user to chat
  ws.chat_id = chatId;
  console.log(`Subbing user: ${ws.user.username} to chatroom: ${chatId}`);
};

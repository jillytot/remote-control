module.exports.loadChat = async chat_id => {
  const { getRecentMessages } = require("../models/chatMessage");
  const { loadMessages } = require("../config/serverSettings");
  const { getChat } = require("../models/chatRoom");
  let chat = await getChat(chat_id);
  let messages = await getRecentMessages(chat_id, loadMessages);
  messages = messages.reverse();
  console.log("MESSAGES CHECK: ", messages);
  if (messages) {
    messages.map(message => {
      chat.messages.push(message);
    });
  } else {
    chat.messages = [];
  }
  return chat;
};

// this.getRecentChatMessages("chat-73faf0bf-531a-4c7c-8744-af7a5b0110c3");

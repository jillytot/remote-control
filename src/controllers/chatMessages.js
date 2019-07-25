module.exports.getRecentChatMessages = async chat_id => {
  const { getRecentMessages } = require("../models/chatMessage");
  const { loadMessages } = require("../config/serverSettings");
  const getMessages = await getRecentMessages(chat_id, loadMessages);
  console.log("GET MESSAGES: ", getMessages);
  return getMessages;
};

// this.getRecentChatMessages("chat-73faf0bf-531a-4c7c-8744-af7a5b0110c3");

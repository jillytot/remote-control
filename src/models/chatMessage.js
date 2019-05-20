const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");

module.exports.createMessage = message => {
  const { saveMessageToActiveChat } = require("./chatRoom");
  //build the message:
  let makeMess = {};
  makeMess.message = message.message;
  makeMess.sender = message.username;
  makeMess.sender_id = message.userId;
  makeMess.chat_id = message.chatId;
  makeMess.id = makeId();
  makeMess.time_stamp = createTimeStamp();
  makeMess.displayMessage = true;
  makeMess.badges = [];
  makeMess.type = "";

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);
  console.log("Generating Chat Message: ", makeMess);
  getMessageType(makeMess);
  this.sendMessage(makeMess);
};

module.exports.sendMessage = message => {
  const { io } = require("../services/server/server");
  let chatRoom = message.chat_id;
  console.log("Chat Room from SendMessage: ", chatRoom);
  io.to(chatRoom).emit("MESSAGE_RECIEVED", message);
};

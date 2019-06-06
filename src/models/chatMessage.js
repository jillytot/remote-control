const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");
const { userTypes } = require("./user");

//What calls create Message?

module.exports.createMessage = async message => {
  const { saveMessageToActiveChat } = require("./chatRoom");
  //build the message:
  let makeMess = {};
  makeMess.message = message.message;
  makeMess.sender = message.username;
  makeMess.sender_id = message.userId;
  makeMess.chat_id = message.chatId;
  makeMess.server_id = message.server_id;
  makeMess.id = `mesg-${makeId()}`;
  makeMess.time_stamp = createTimeStamp();
  makeMess.displayMessage = true;
  makeMess.badges = await this.getBadges(message.userType);
  makeMess.type = "";

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);
  console.log("Generating Chat Message: ", makeMess);
  makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
};

module.exports.sendMessage = message => {
  const { io } = require("../services/server/server");
  let chatRoom = message.chat_id;
  console.log("Chat Room from SendMessage: ", chatRoom);
  io.to(chatRoom).emit("MESSAGE_RECIEVED", message);
};

//Definitely needs more work
/*
4 max badges, 
badge 1 - global type, badge 2 - local type, badge 3 - sub / patreon, badge 4 - hmmmm
needs more design : D
*/
module.exports.getBadges = checkTypes => {
  if (Array.isArray(checkTypes)) {
    return checkTypes.map(checkType => {
      if (checkType === "staff") return "staff";
    });
  }
  return [];
};

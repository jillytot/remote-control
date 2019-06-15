const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");
const { getGlobalTypes } = require("./user");

//Create Message is called from events/index as an incoming socket.io event from the client
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

  //Flag for displaying a default message type in chat
  makeMess.displayMessage = true;

  //Get global types from the server
  const globalTypes = await getGlobalTypes(message.userId);

  makeMess.badges = await this.getBadges(
    globalTypes,
    message.server_id,
    message.userId
  );

  //message.type is a flag that indicates what purpose the message is meant to serve,
  //a message isn't a chat message, a chat message is just a type of message
  //Currently, all messages are sent from client/src/components/chat/sendChat.jsx
  makeMess.type = ""; //default none means a simple chat message

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);

  console.log("Generating Chat Message: ", makeMess);
  makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
};

module.exports.sendMessage = message => {
  //TODO: ensure that chatRoom is provided by /src/events/index and not the message directly from the client
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

//returns chat badges for a user both globally and for the specified server
module.exports.getBadges = async (checkTypes, server_id, userId) => {
  if (checkTypes) {
    // do nothing
    console.log("CHECK TYPES :", checkTypes);
  } else {
    checkTypes = [];
  }
  console.log("GET BADGES PRE-CHECK: ", checkTypes, server_id, userId);
  const { getLocalTypes } = require("./robotServer");
  const addTypes = await getLocalTypes(server_id, userId);
  addTypes.forEach(type => {
    checkTypes.push(type);
  });
  console.log("GET BADGES: ", checkTypes, server_id, userId);

  if (Array.isArray(checkTypes)) {
    console.log("CHECK TYPES: ", checkTypes);
    checkTypes = Array.from(new Set(checkTypes));
    return checkTypes;
  }
  return [];
};

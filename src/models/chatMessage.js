const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");
const { getGlobalRoles } = require("./user");

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

  //Get global roles from the server
  const globalRoles = await getGlobalRoles(message.userId);

  makeMess.badges = await this.getBadges(
    globalRoles,
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
module.exports.getBadges = async (checkRoles, server_id, userId) => {
  if (checkRoles) {
    // do nothing
    console.log("CHECK ROLES :", checkRoles);
  } else {
    checkRoles = [];
  }
  console.log("GET BADGES PRE-CHECK: ", checkRoles, server_id, userId);
  const { getLocalRoles } = require("./robotServer");
  const addRoles = await getLocalRoles(server_id, userId);
  addRoles.forEach(type => {
    checkRoles.push(type);
  });
  console.log("GET BADGES: ", checkRoles, server_id, userId);

  if (Array.isArray(checkRoles)) {
    console.log("CHECK ROLES: ", checkRoles);
    checkRoles = Array.from(new Set(checkRoles));
    return checkRoles;
  }
  return [];
};

const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");
const { getGlobalTypes } = require("./user");

//Create Message is called from events/index as an incoming socket.io event from the client
module.exports.createMessage = async message => {
  const { saveMessageToActiveChat } = require("./chatRoom");
  //build the message:
  let makeMess = {};
  makeMess.message = message.message;
  makeMess.sender = message.user.username; //Will deprecate
  makeMess.sender_id = message.user.id; //Will deprecate
  makeMess.chat_id = message.chatId;
  makeMess.server_id = message.server_id;
  makeMess.id = `mesg-${makeId()}`;
  makeMess.time_stamp = createTimeStamp();
  makeMess.broadcast = message.broadcast || ""; // Flag for determining if message is broadcasted to the room, or just to the user

  //makeMess.user = message.user; //ws verifies the user, calls the DB, and attaches it to message before it's sent here

  //Flag for displaying a default message type in chat
  makeMess.displayMessage = true;

  //Get global types from the server
  // const globalTypes = message.user.type;
  // makeMess.roles = message.user.type || ""; //default none means a simple chat message
  makeMess.badges = await this.getBadges(
    message.user.type,
    message.server_id,
    message.userId
  );

  //message.type is a flag that indicates what purpose the message is meant to serve,
  //a message isn't a chat message, a chat message is just a type of message
  //Currently, all messages are sent from client/src/components/chat/sendChat.jsx
  makeMess.type = message.type || "";

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);

  console.log("Generating Chat Message: ", makeMess);
  makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
};

//Like User Message, except for robots
module.exports.createRobotMessage = async message => {
  let makeMess = {};
  makeMess.message = message.message;
  makeMess.sender = message.robot.name; //Will deprecate
  makeMess.sender_id = message.robot.id; //Will deprecate
  makeMess.chat_id = message.chatId;
  makeMess.server_id = message.server_id;
  makeMess.id = `mesg-${makeId()}`;
  makeMess.time_stamp = createTimeStamp();
  makeMess.broadcast = message.broadcast || ""; // Flag for determining if message is broadcasted to the room, or just to the user
  makeMess.displayMessage = true;
  makeMess.badges = await this.getBadges(
    message.type,
    message.server_id,
    message.userId
  );
  makeMess.type = message.type;
  console.log("Generating Robot Chat Message: ", makeMess);
  //makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
};

module.exports.sendMessage = message => {
  const chatRoomModel = require("../models/chatRoom");
  const userModel = require("../models/user");
  //TODO: ensure that chatRoom is provided by /src/events/index and not the message directly from the client

  if (message.broadcast === "self") {
    userModel.emitEvent(message.sender_id, "MESSAGE_RECIEVED", message);
    return;
  }

  let chatRoom = message.chat_id;
  console.log("Chat Room from SendMessage: ", chatRoom, message);
  chatRoomModel.emitEvent(chatRoom, "MESSAGE_RECIEVED", message);
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
    console.log("CHECK TYPES :", checkRoles);
  } else {
    checkRoles = [];
  }
  console.log("GET BADGES PRE-CHECK: ", checkRoles, server_id, userId);
  const { getLocalTypes } = require("./robotServer");
  const addTypes = await getLocalTypes(server_id, userId);
  addTypes.forEach(type => {
    checkRoles.push(type);
  });
  console.log("GET BADGES: ", checkRoles, server_id, userId);

  if (Array.isArray(checkRoles)) {
    console.log("CHECK TYPES: ", checkRoles);
    checkRoles = Array.from(new Set(checkRoles));
    return checkRoles;
  }
  return [];
};

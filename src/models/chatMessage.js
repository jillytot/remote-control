const { makeId, createTimeStamp } = require("../modules/utilities");
const { getMessageType } = require("./chatCommands");

//Create Message is called from events/index as an incoming socket.io event from the client
module.exports.createMessage = async message => {
  const { filterPhoneticMessage } = require("../controllers/chatFilter");
  const { getRobotServerSettings } = require("../models/robotServer");
  //build the message:
  let makeMess = {};
  const serverSettings = await getRobotServerSettings(message.server_id);
  if (serverSettings.settings.phonetic_filter) {
    makeMess.message = await filterPhoneticMessage(message.message);
  } else {
    makeMess.message = message.message;
  }
  makeMess.sender = message.user.username; //Will deprecate
  makeMess.sender_id = message.user.id; //Will deprecate
  makeMess.chat_id = message.chatId;
  makeMess.server_id = message.server_id;
  makeMess.id = `mesg-${makeId()}`;
  makeMess.time_stamp = createTimeStamp();
  makeMess.broadcast = message.broadcast || ""; // Flag for determining if message is broadcasted to the room, or just to the user
  makeMess.channel_id = message.channel_id || "";

  //makeMess.user = message.user; //ws verifies the user, calls the DB, and attaches it to message before it's sent here

  //Flag for displaying a default message type in chat
  makeMess.display_message = true;

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
  if (message.patreon) makeMess.patreon = message.patreon;

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);

  // console.log("Generating Chat Message: ", makeMess);
  makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
  await this.saveMessage(makeMess);
  return;
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
  makeMess.channel_id = message.channel_id || "";
  makeMess.display_message = true;
  makeMess.badges = await this.getBadges(
    [message.type],
    message.server_id,
    message.userId
  );
  makeMess.type = message.type;

  // console.log("Generating Robot Chat Message: ", makeMess);
  //makeMess = await getMessageType(makeMess);
  this.sendMessage(makeMess);
  const save = await this.saveMessage(makeMess);
  console.log(save);
  return;
};

module.exports.saveMessage = async getMessage => {
  const db = require("../services/db");
  const {
    message,
    sender,
    sender_id,
    chat_id,
    server_id,
    id,
    time_stamp,
    broadcast,
    display_message,
    badges,
    type,
    channel_id
  } = getMessage;

  const dbPut = `INSERT INTO chat_messages ( message,
    sender,
    sender_id,
    chat_id,
    server_id,
    id,
    time_stamp,
    broadcast,
    display_message,
    badges,
    type, channel_id ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 ) RETURNING *`;
  console.log("SAVING MESSAGE...");
  try {
    const result = await db.query(dbPut, [
      message,
      sender,
      sender_id,
      chat_id,
      server_id,
      id,
      time_stamp,
      broadcast,
      display_message,
      badges,
      type,
      channel_id
    ]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.getRecentMessages = async (chat_id, numberOfMessages) => {
  const db = require("../services/db");
  //TODO: Maybe don't return messages more than 24 hours old
  console.log("MESSAGE CHECK 2: ", chat_id, numberOfMessages);
  const query = `SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY time_stamp DESC LIMIT ${numberOfMessages ||
    10}`;
  try {
    const result = await db.query(query, [chat_id]);
    if (result.rows) {
      // console.log(result.rows);
      return result.rows;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.sendMessage = message => {
  const chatRoomModel = require("../models/chatRoom");
  const userModel = require("../models/user");
  //TODO: ensure that chatRoom is provided by /src/events/index and not the message directly from the client

  if (message.broadcast === "self") {
    userModel.emitEvent(message.sender_id, "MESSAGE_RECEIVED", message);
    return;
  }

  let chatRoom = message.chat_id;
  // console.log("Chat Room from SendMessage: ", chatRoom, message);
  chatRoomModel.emitEvent(chatRoom, "MESSAGE_RECEIVED", message);
};

//Definitely needs more work
/*
4 max badges, 
badge 1 - global type, badge 2 - local type, badge 3 - sub / patreon, badge 4 - hmmmm
needs more design : D
*/

//returns chat badges for a user both globally and for the specified server
module.exports.getBadges = async (checkRoles, server_id, userId) => {
  const { getPatron } = require("../models/patreon");

  if (checkRoles) {
    // do nothing
    console.log("CHECK TYPES :", checkRoles);
  } else {
    checkRoles = [];
  }

  //handle Patreon:
  const checkPatreon = await getPatron({ user_id: userId });
  console.log("PATREON CHECK: ", checkPatreon);
  if (
    checkPatreon &&
    checkPatreon.active_rewards &&
    checkPatreon.active_rewards.reward_amount
  ) {
    checkRoles.push(`patreon${checkPatreon.active_rewards.reward_amount}`);
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

//Update display message for all user messages located on a server
module.exports.updateDisplayMessage = async ({ sender_id, server_id }) => {
  const db = require("../services/db");
  const display_message = false;
  console.log("Updating Message Status");
  const query = `UPDATE chat_messages SET display_message = $1 WHERE (sender_id, server_id) = ($2, $3) RETURNING *`;
  try {
    const result = await db.query(query, [
      display_message,
      sender_id,
      server_id
    ]);
    if (result.rows) return result.rows;
  } catch (err) {
    console.log("err");
  }
  return null;
};

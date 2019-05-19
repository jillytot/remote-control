const { makeId, createTimeStamp } = require("../modules/utilities");

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
  makeMess.type = "";

  //Turn this back on once you start removing active chats from memmory
  //saveMessageToActiveChat(makeMess);

  this.sendMessage(makeMess);
};

module.exports.sendMessage = message => {
  const { io } = require("../services/server/server");
  let chatRoom = message.chat_id;
  console.log("Chat Room from SendMessage: ", chatRoom);
  io.to(chatRoom).emit("MESSAGE_RECIEVED", message);
};

module.exports.messageType = message => {
  const command = RegExp("/");

  //Check entry character & assign message types
  if (message.message.charAt(0) === "/") message.type = "site-command";
  if (message.message.charAt(0) === ".") message.type = "robot-command";
  if (message.message.charAt(0) === "#") message.type = "donate";

  //execute based on message types
  if (message.type === "site-command") siteCommands(message);

  //send final message to chat
  return message;
};

//commands for managing the site through chat
siteCommands = message => {
  let updateCommand = message;
  let scrubCommand = message.message
    .substr(1)
    .split(" ")[0]
    .toLowerCase();

  if (scrubCommand === "me") updateCommand = me(updateCommand);
  if (scrubCommand === "w") message.type = "whisper";
  if (scrubCommand === "timeout") message.type = "moderation";
  if (scrubCommand === "mod") message.type = "moderation";
  if (scrubCommand === "unmod") message.type = "moderation";

  console.log("Do Command: ", scrubCommand);
  message = updateCommand;
  return message;
};

me = message => {
  message.type = "self";
  message.message = message.message.substr(4);
  console.log(message.message);
  return message;
};

//Moderate
moderate = (moderate, validate) => {
  //Does the command ( moderate ) come from a moderator ( validate )?
  //If so, grab the name of the person to be moderated.
  //execute moderation commands.
};

// commandList = {
//    timeout: timeout,
// }

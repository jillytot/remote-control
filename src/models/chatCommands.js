const { createTimeStamp } = require("../modules/utilities");
const { localTimeout, localUnTimeout } = require("../controllers/moderation");

/*
Reactor Todos: 

Command Router: 
Message >> Command Router >> Executables >> Return Message
Message comes from client via webosckets
Command Router will parse the first two arguments, 
Then any further parsing will happen in the executables themselves
A message must be returned, as that will be sent out to the client side users
*/

module.exports.getMessageType = async message => {
  if (message.message.charAt(0) === "/") {
    message.type = "site-command";
    message = await siteCommands(message);
  }
  return message;
};

//commands for managing the site through chat
siteCommands = async message => {
  const { kickMember } = require("../controllers/moderation");
  let updateCommand = message;
  let scrubCommand = message.message
    .substr(1)
    .split(" ")[0]
    .toLowerCase();

  if (scrubCommand === "me") updateCommand = me(updateCommand);
  if (scrubCommand === "w") message.type = "whisper";
  if (scrubCommand === "suspend")
    //Suspend is the global version of timeout
    //TODO: Call the new moderation script
    message = await parseModerate(message, scrubCommand);
  if (scrubCommand === "unsuspend")
    message = await parseModerate(message, scrubCommand);

  if (scrubCommand === "timeout") message = await localTimeout(message);
  if (scrubCommand === "untimeout") message = await localUnTimeout(message);
  if (scrubCommand === "kick") message = await kickMember(message);

  if (scrubCommand === "mod") message.type = "moderation";
  if (scrubCommand === "unmod") message.type = "moderation";

  // if (scrubCommand === "disable") await disbleServer(message);

  //Need to work on this more.
  console.log("Do Command: ", scrubCommand);
  console.log("FROM SITE COMMANDS: ", message.message);
  message = updateCommand;
  return message;
};

me = message => {
  message.type = "self";
  message.message = message.message.substr(4);
  console.log(message.message);
  return message;
};

//May deprecate
module.exports.calcTimeout = time => {
  console.log(typeof time);

  let makeTimeStamp = createTimeStamp();
  let timeStamp = Math.floor(makeTimeStamp / 1000);
  const calculate = (timeStamp + time) * 1000;
  console.log(
    "Calculating Timeout: ",
    makeTimeStamp,
    timeStamp,
    time,
    calculate
  );
  return calculate;
};

//TIMEOUT LOGIC

//Preparing information to get fed into timeout handler
const parseModerate = async (message, action) => {
  message.type = "moderation";
  let moderate = {};

  moderate.username = message.message
    .substr(1)
    .split(" ")[1]
    .toLowerCase();
  moderate.moderator = {
    username: message.sender, //Create Object for message sender
    id: message.sender_id,
    chat_id: message.chat_id
  };
  moderate.message = message;
  moderate.action = action;

  if (action === "suspend") {
    moderate.time = message.message
      .substr(1)
      .split(" ")[2]
      .toLowerCase();
  }
  const doTimeout = await this.handleGlobalTimeout(moderate);
  console.log("MESSAGE FROM parseModerate: ", doTimeout);
  return doTimeout;
};

const {
  getIdFromUsername,
  timeoutUser,
  getUserInfoFromId,
  checkTypes
} = require("./user");

const globalTypes = ["staff", "global_moderator"]; // Types that can access this command

//This is basically a global timeout
module.exports.handleGlobalTimeout = async ({
  username,
  moderator,
  time,
  message,
  action
}) => {
  console.log(username, moderator, time, message);

  if (username.toLowerCase() === moderator.username.toLowerCase()) {
    message.message = `${moderator.username}, You cannot timeout yourself...`;
    return message;
  }

  if (username.toLowerCase() === "jill") {
    message.message = `${moderator.username}, how dare you timeout jill`;
    return message;
  }

  const validateCommand = await checkTypes(moderator, globalTypes); //Can this user use this command?
  if (validateCommand) {
    console.log("COMMAND VALIDATION TRUE");
  } else {
    message.broadcast = "self";
    message.message = "You have insufficent privileges for this action";
    return message;
  }

  let thisUser = await getIdFromUsername(username);
  thisUser = await getUserInfoFromId(thisUser);
  let actOnUser = {};
  //Execute Timeout

  if (action === "suspend") {
    if (username) {
      time = parseInt(time);
      if (Number.isInteger(time)) {
        //continue
      } else {
        console.log("INTEGER REQUIRED");
        message.displayMessage = false;
        return message;
      }
    }
    if (time < 0) {
      message.displayMessage = false;
      return message;
    }

    //Set the maximum timeout
    const { maxTimeout } = require("../config/server");
    if (time > maxTimeout) time = maxTimeout;
    console.log("TIMEOUT FOR TIME: ", time, maxTimeout);
    time *= 1000;
    thisUser = await timeoutUser(thisUser, time);

    if (thisUser) {
      actOnUser = thisUser;
      console.log("Chat Commands : handleTimeout : thisUser: ", thisUser);
      message.message = `User ${
        actOnUser.username
      } has been put in timeout for ${time / 1000} seconds.`;
      console.log("MESSAGE FROM SET GLOBAL TIMEOUT: ", message.message);
      const { sendGlobalTimeout } = require("./robotServer");
      sendGlobalTimeout(message.server_id, actOnUser);
      return message;
    }
  }

  if (action === "unsuspend") {
    const { clearGlobalTimeout } = require("./user");
    let unTimeout = clearGlobalTimeout(thisUser);
    if (unTimeout) {
      actOnUser = thisUser;
      console.log("Chat Commands : handleUntimeout : thisUser: ", thisUser);
      message.message = `User ${actOnUser.username} your timeout status has been removed`;

      console.log("MESSAGE FROM GLOBAL UNTIMEOUT: ", message.message);
      // const { sendGlobalTimeout } = require("./robotServer");
      // sendGlobalTimeout(message.server_id, actOnUser);
      return message;
    }

    console.log("Could not locate user");
    message.displayMessage = false;

    // io.emit

    return message;
  }
  return message;
};

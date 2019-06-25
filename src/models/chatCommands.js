const { createTimeStamp } = require("../modules/utilities");

module.exports.getMessageType = async message => {
  //Check entry character & assign message types
  if (message.message.charAt(0) === "/") message.type = "site-command";

  //execute based on message types
  if (message.type === "site-command") message = siteCommands(message);

  //send final message to chat
  return message;
};

//commands for managing the site through chat
siteCommands = async message => {
  let updateCommand = message;
  let scrubCommand = message.message
    .substr(1)
    .split(" ")[0]
    .toLowerCase();

  if (scrubCommand === "me") updateCommand = me(updateCommand);
  if (scrubCommand === "w") message.type = "whisper";
  if (scrubCommand === "timeout") message = await parseTimeout(message);

  if (scrubCommand === "mod") message.type = "moderation";
  if (scrubCommand === "unmod") message.type = "moderation";

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
const parseTimeout = async message => {
  message.type = "moderation";
  const doTimeout = await this.handleGlobalTimeout(
    message.message
      .substr(1)
      .split(" ")[1]
      .toLowerCase(),
    {
      username: message.sender, //Create Object for message sender
      id: message.sender_id,
      chat_id: message.chat_id
    },
    message.message
      .substr(1)
      .split(" ")[2]
      .toLowerCase(),
    message
  );
  console.log("MESSAGE FROM PARSETIMEOUT: ", doTimeout);
  return doTimeout;
};

const {
  validateUser,
  getIdFromUsername,
  timeoutUser,
  getUserInfoFromId,
  checkTypes
} = require("./user");

const globalTypes = ["staff", "global_moderator"]; // Types that can access this command

//This is basically a global timeout
module.exports.handleGlobalTimeout = async (
  username,
  moderator,
  time,
  message
) => {
  const validateCommand = await checkTypes(moderator, globalTypes); //Can this user use this command?
  if (validateCommand) {
    console.log("COMMAND VALIDATION TRUE");
  } else {
    console.log(moderator, " has insufficent privelages for this action");
    message.displayMessage = false;
    return {
      status: "failed",
      message:
        "You have insufficent privelages for this action. You must either be type: staff, or global_mod"
    };
  }

  let badUser = {};
  //Execute Timeout
  if (username && time) {
    time = parseInt(time);
    if (Number.isInteger(time)) {
      //continue
    } else {
      console.log("INTEGER REQUIRED");
      message.displayMessage = false;
      return message;
    }
    if (time < 0) {
      message.displayMessage = false;
      return message;
    }

    time *= 1000;

    let thisUser = await getIdFromUsername(username);

    if (thisUser) {
      thisUser = await getUserInfoFromId(thisUser);
      thisUser = await timeoutUser(thisUser, time);

      if (thisUser) {
        badUser = thisUser;
        console.log("Chat Commands : handleTimeout : thisUser: ", thisUser);
        message.message = `User ${
          badUser.username
        } has been globally timed out for ${time / 1000} seconds.`;
        console.log("MESSAGE FROM SET GLOBAL TIMEOUT: ", message.message);
        const { sendGlobalTimeout } = require("./robotServer");
        sendGlobalTimeout(message.server_id, badUser);
        return message;
      }
    }
    console.log("Could not locate user");
    message.displayMessage = false;

    // io.emit

    return message;
  }
  return message;
};

/*
User gets timed out. User's status is set to being timed out. 
A general message should be shown to people in chat that tells them who has been timed out, and for how long
Making an incorrect command should give the user direct feedback on the client side
If timedout user tries to type or do things, they will get a message telling them they are still timedout / banned

All messages by removed user also get removed
A log is added to the user indicating when and where they got timed out and by who
YOU SHOULD NOT BE ABLE TO BAN YOURSELF
*/

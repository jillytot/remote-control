const { createTimeStamp, getDateAndTime } = require("../modules/utilities");

module.exports.getMessageType = message => {
  const command = RegExp("/");

  //Check entry character & assign message types
  if (message.message.charAt(0) === "/") message.type = "site-command";
  //if (message.message.charAt(0) === ".") message.type = "robot-command";
  //if (message.message.charAt(0) === "#") message.type = "donate";

  //execute based on message types
  if (message.type === "site-command") siteCommands(message);

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
  if (scrubCommand === "timeout") await parseTimeout(message);

  if (scrubCommand === "mod") message.type = "moderation";
  if (scrubCommand === "unmod") message.type = "moderation";

  //Need to work on this more.
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
  await this.handleGlobalTimeout(
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
      .toLowerCase()
  );
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
module.exports.handleGlobalTimeout = async (username, moderator, time) => {
  console.log("STARTING GLOBAL TIMEOUT: ", username, time, moderator);
  const validateCommand = await checkTypes(moderator, globalTypes); //Can this user use this command?
  console.log("VALIDATE COMMAND RESULT: ", validateCommand);
  if (validateCommand) {
    //continue
  } else {
    console.log(moderator, " has insufficent privelages for this action");
    return {
      status: "failed",
      message:
        "You have insufficent privelages for this action. You must either be type: staff, or global_mod"
    };
  }

  //Execute Timeout
  if (username && time) {
    console.log("GLOBAL TIMEOUT FROM CHAT", username, time);
    time *= 1000;
    const check = await validateUser({
      //Make sure this user exists
      username: username
    });

    if (check) {
      let thisUser = await getIdFromUsername(username);
      thisUser = await getUserInfoFromId(thisUser);
      thisUser = await timeoutUser(thisUser, time);

      if (thisUser) {
        console.log("Chat Commands : handleTimeout : thisUser: ", thisUser);
        return {
          status: "success",
          message: `User ${username} has been timed out for ${time}`
        };
      }
    }
    console.log("Could not locate user");
    return {
      status: "failed",
      message: `cannot find user: ${username}, make sure username is spelled correctly.`
    };
  }
};

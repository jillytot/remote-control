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

// commandList = {
//    timeout: timeout,
// }

//timeout a specific user from the entire site
const globalTypes = ["staff", "global_moderator"];
module.exports.globalTimeout = (mod, time, badUser) => {
  //validate moderator
  mod.type.map(t => {
    if (t.includes(globalTypes) === false) {
      return {
        status:
          "You insufficent privelages for this action. You must either be type: staff, or global_mod"
      };
    }
  });

  //Select Target User:
  //Set Global Status for timeout
  //Set all messages created by user before timeout to "displayMessage = false"
};

module.exports.calcTimeout = time => {
  //return createTimeStamp() + time;
  //let timeStamp = Math.floor(createTimeStamp() / 1000);
  const timeStamp = getDateAndTime();
  const calculate = timeStamp + time;
  console.log("Calculating Timeout: ", timeStamp, calculate);
  return calculate;
};

const globalStatusPt = {
  timeout: ""
};

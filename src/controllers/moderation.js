/*
import Message from '../components/layout/chat/message';
Server Level: 
Timeout - No chat or controls
Kick - Remove user as a member, but doesn't ban them
Ban - Removes user's ability to enter a server
Lock - No Controls
Mute - No TTS
Block - Users invisible to each other

Global Level: 
Global Timeout - Unable to Use any site features that interact with users or robots
Global Ban - Same, but permanent 
Disable Server - Removes access to server for all users except owner and global level moderators
Lock Server - No one can access a lock server except for global level mods
Delete Server - Delete
*/

//LOCAL TIMEOUT SEQUENCE
module.exports.localTimeout = async moderate => {
  moderate.error = false; //init error flag
  moderate = parseInput(moderate);
  moderate = await getMembers(moderate);
  if (moderate.message["error"] === false) moderate = checkTimeout(moderate);
  if (moderate.message["error"] === false) moderate = checkTime(moderate);
  if (moderate.message["error"] === false)
    moderate = await this.handleLocalTimeout(moderate);
  return moderate.message;
};

const checkTime = ({ arg, badUser, moderator, message }) => {
  console.log("Check timeout time: ", arg);
  const { maxTimeout } = require("../config/serverSettings");
  let time = parseInt(arg);
  if (!Number.isInteger(time)) {
    message.message = "Integer Required for Timeout";
    message.broadcast = "self";
    message.error = true;
    return { arg, badUser, moderator, message };
  }

  if (time < 0) time = 0;
  if (time > maxTimeout) time = maxTimeout;
  arg = time * 1000;
  return { arg, badUser, moderator, message };
};

//PARSE INPUT
const parseInput = message => {
  console.log("Parsing Command Input");
  message.type = "moderation";
  let badUser = message.message
    .substr(1)
    .split(" ")[1]
    .toLowerCase();
  const arg = message.message
    .substr(1)
    .split(" ")[2]
    .toLowerCase();
  let moderator = {
    user_id: message.sender_id,
    server_id: message.server_id
  };
  return { arg: arg, badUser: badUser, moderator: moderator, message: message };
};

const getMembers = async ({ arg, badUser, moderator, message }) => {
  console.log("Verifying users for moderation");
  const badUsername = badUser;
  const { getIdFromUsername } = require("../models/user");
  const { getMember } = require("../models/serverMembers");

  moderator = await getMember({
    server_id: message.server_id,
    user_id: message.sender_id
  });
  console.log("MODERATOR CHECK");
  //TOOD: CHECK MODERATOR ROLES, THIS SHOULD BE CHECKED BEFORE BADUSER IS SEARCHED FOR
  if (!moderator) {
    message.message = `Moderation Verification Error!`;
    message.error = true;
    message.broadcast = "self";
    return { arg, badUser, moderator, message };
  }

  moderator.username = message.sender;
  badUser = await getIdFromUsername(badUsername);
  //If No Bad User ?
  if (!badUser) {
    message = handleError(
      message,
      `${badUsername}, does not exist, are you sure you typed it correctly?`
    );
    return { arg, badUser, moderator, message };
  }

  badUser = await getMember({ server_id: message.server_id, user_id: badUser });
  badUser.username = badUsername;
  return { arg, badUser, moderator, message };
};

//CHECK TIMEOUT COMMAND FOR ERRORS
const checkTimeout = ({ arg, badUser, moderator, message }) => {
  console.log("Checking timeout command for errors");

  //YOU CAN'T TIMEOUT JILL, DONT EVEN TRY
  if (badUser.username === "jill") {
    message = handleError(
      message,
      `${moderator.username}, how dare you timeout jill`
    );
    return { arg, badUser, moderator, message };
  }

  //YOU CAN'T TIME YOURSELF OUT
  if (badUser.username.toLowerCase() === moderator.username.toLowerCase()) {
    message = handleError(
      message,
      `${badUser.username}, You cannot timeout yourself...`
    );
    return { arg, badUser, moderator, message };
  }

  return { arg, badUser, moderator, message };
};

//Note: User refers to global user, Member refers to server member (AKA local user)
module.exports.handleLocalTimeout = async ({
  arg,
  badUser,
  moderator,
  message
}) => {
  const { createTimer } = require("../modules/utilities");
  const { updateMemberStatus } = require("../models/serverMembers");
  let time = arg;
  badUser.status.timeout = true;

  if (
    badUser.status.expireTimeout &&
    badUser.status.expireTimeout > Date.now()
  ) {
    const addRemainder = badUser.status.expireTimeout - (time + Date.now());
    console.log(
      "User is already timed out, checking for remainder: ",
      addRemainder
    );
    if (addRemainder > 0) time = addRemainder;
  }
  badUser.status.expireTimeout = Date.now() + time;
  console.log(
    "TIMEOUT STATUS CHECK: ",
    badUser.status,
    badUser.status.expireTimeout - Date.now()
  );
  let checkUpdatedStatus = await updateMemberStatus(badUser); //Member Status
  if (!checkUpdatedStatus) {
    message = handleError(message, "Unable to timeout user");
  } else {
    message.message = `User ${badUser.username} has been timed out for ${time /
      1000} seconds.`;
    createTimer(time, clearLocalTimeout, badUser);
  }
  return { arg, badUser, moderator, message };
};

const clearLocalTimeout = async member => {
  console.log("Clearing timeout for local member");
  const { updateMemberStatus } = require("../models/serverMembers");
  member.status.expireTimeout = 0;
  member.status.timeout = false;
  const clearUser = await updateMemberStatus(member);
  if (clearUser) return true;
  return null;
};

const handleError = (message, error) => {
  message.error = true;
  message.broadcast = "self";
  message.message = error;
  return message;
};

/*
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
module.exports.localTimeout = async message => {
  let moderate = parseInput(message);
  moderate = await getMembers(moderate);
  moderate = checkTimeout(moderate);
  moderate = checkTime(moderate);
};

const checkTime = moderate => {
  console.log("Check timeout time: ", moderate.arg);
  const { maxTimeout } = require("../config/serverSettings");
  let time = parseInt(moderate.arg);
  if (!Number.isInteger(time)) {
    moderate.message.message = "Integer Required for Timeout";
    moderate.message.broadcast = "self";
    moderate.message.error = true;
    return moderate;
  }

  if (time < 0) time = 0;
  if (time > maxTimeout) time = maxTimeout;
  moderate.arg = time * 1000;
  return moderate;
};

//PARSE INPUT
const parseInput = message => {
  console.log("Parsing Command Input");
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

const getMembers = async moderate => {
  console.log("Verifying users for moderation");
  let { badUser, moderator, message } = moderate;
  const badUsername = badUser;
  const { getIdFromUsername } = require("../models/user");
  const { getMember } = require("../models/serverMembers");
  badUser = await getIdFromUsername(badUsername);
  badUser = await getMember({ server_id: message.server_id, user_id: badUser });
  //If No Bad User ?
  if (!badUser) {
    moderate.message.message = `${
      badUser.username
    }, does not exist, are you sure you typed it correctly?`;
    moderate.message.error = true;
    moderate.message.broadcast = "self";
  }

  badUser.username = badUsername;
  moderator = await getMember(moderator);
  if (!moderator) {
    moderate.message.message = `Moderation Verification Error!`;
    moderate.message.error = true;
    moderate.message.broadcast = "self";
  }

  moderator.username = message.sender;
  moderate.badUser = badUser;
  moderate.moderator = moderator;
  return moderate;
};

//CHECK TIMEOUT COMMAND FOR ERRORS
const checkTimeout = async moderate => {
  console.log("Checking timeout command for errors");
  let { arg, badUser, moderator, message } = moderate;

  //YOU CAN'T TIME YOURSELF OUT
  if (badUser.username.toLowerCase() === moderator.username.toLowerCase()) {
    message.message = `${badUser.username}, You cannot timeout yourself...`;
    message.error = true;
    message.broadcast = "self";
    moderate = { arg, badUser, moderator, message };
    return moderate;
  }

  //YOU CAN'T TIMEOUT JILL, DONT EVEN TRY
  if (badUser.username === "jill") {
    message.message = `${moderator.username}, how dare you timeout jill`;
    message.error = true;
    message.broadcast = "self";
    moderate = { arg, badUser, moderator, message };
    return moderate;
  }
  moderate = { arg, badUser, moderator, message };
  return moderate;
};

//Note: User refers to global user, Member refers to server member (AKA local user)
module.exports.handleLocalTimeout = async (user_id, server_id, time) => {
  const { createTimer } = require("../modules/utilities");
  const { updateMemberStatus } = require("../models/serverMembers");

  //Todo:
  //Verify Member
  //Check Member Roles

  console.log("TIMEOUT USER: ", member, time);
  if (user && time) {
    let { status } = member;
    status.timeout = true;
    if (status.expireTimeout && status.expireTimeout > Date.now()) {
      const addRemainder = status.expireTimeout - (time + Date.now());
      console.log(
        "User is already timed out, checking for remainder: ",
        addRemainder
      );
      if (addRemainder <= 0) return status;
      time = addRemainder;
    }
    status.expireTimeout = Date.now() + time;
    console.log(
      "TIMEOUT STATUS CHECK: ",
      status,
      status.expireTimeout - Date.now()
    );
    member.status = status;
    let checkUpdatedStatus = await updateMemberStatus(member); //Member Status
    createTimer(time, removeLocalTimeout, member);
    return checkUpdatedStatus;
  }
  console.log("Timout Error");
  return null;
};

// const removeLocalTimeout = () => {};

const calcTimeout = time => {
  console.log(typeof time);
  const { createTimeStamp } = require("../modules/utilities");

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

//Authorize Moderator - Verify, Check Roles
//Verify badUser

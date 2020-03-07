/*
import Message from '../components/layout/chat/message';
Server Level: 
Done -  Timeout - No chat or controls
Done -  Untimeout - remove a timeout
Done -  Kick - Remove user as a member, but doesn't ban them
        Ban - Removes user's ability to enter a server
        Lock - No Controls
        Mute - No TTS
        Block - Users invisible to each other

Global Level: 
suspend, AKA Global Timeout - Unable to Use any site features that interact with users or robots
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
  if (moderate.message["error"] === false)
    moderate = await authCommand(moderate);
  if (moderate.message["error"] === false) moderate = checkTimeout(moderate);
  if (moderate.message["error"] === false) moderate = checkTime(moderate);
  if (moderate.message["error"] === false) {
    moderate = await this.handleLocalTimeout(moderate);
    await localMessageRemoval(moderate); //flags messages in DB not to be published to client
  }

  // console.log("MODERATION CHECK: ", moderate);
  return moderate.message;
};

//Stand alone command for clearing chat messages
module.exports.clearLocalMessagesFromMember = async moderate => {
  // console.log("///////CLEAR MESSAGES FROM USER//////////", moderate);
  moderate.error = false;
  moderate = parseInput(moderate);
  moderate = await getMembers(moderate);
  if (moderate.message["error"] === false) moderate.level = "global";
  moderate = await authCommand(moderate);
  if (moderate.message["error"] === false) {
    await localMessageRemoval(moderate);
    moderate.message.message = `Removing messages from ${moderate.badUser.username}.`;
  }
  return moderate.message;
};

module.exports.localUnTimeout = async moderate => {
  moderate.error = false; //init error flag
  moderate = parseInput(moderate);
  moderate = await getMembers(moderate);
  if (moderate.message["error"] === false)
    moderate = await authCommand(moderate);
  if (moderate.message["error"] === false) checkForTimeouts(moderate);
  if (moderate.message["error"] === false)
    moderate = await this.handleLocalUnTimeout(moderate);

  // console.log("UNTIMEOUT CHECK: ", moderate);
  return moderate.message;
};

module.exports.kickMember = async moderate => {
  const { emitEvent } = require("../models/user");
  // console.log("KICK MEMBER!");
  moderate.error = false;
  moderate = parseInput(moderate);
  moderate = await getMembers(moderate);
  if (moderate.message["error"] === false)
    moderate = await authCommand(moderate);
  if (moderate.message["error"] === false) {
    moderate = await doKickMember(moderate);
    // console.log(
    //   "CHECK MODERATION EVENT: ",
    //   moderate.message.server_id,
    //   moderate.badUser.user_id
    // );
    emitEvent(moderate.badUser.user_id, "MODERATION_EVENT", {
      event: "kicked",
      server_id: moderate.message.server_id
    });
    await localMessageRemoval(moderate);
    // console.log("KICK MEMBER CHECK: ", moderate.badUser.username);
  }
  return moderate.message;
};

const doKickMember = async moderate => {
  const { leaveServer } = require("../controllers/members");
  let { badUser } = moderate;
  const name = badUser.username;
  //const { updateMemberStatus } = require("../models/serverMembers");

  //const update = await updateMemberStatus(badUser);
  badUser = await leaveServer(badUser);
  if (badUser) {
    moderate.badUser = badUser;
    moderate.message.message = `User ${name} has been kicked from this server. `;
    return moderate;
  }
  moderate.message = handleError(
    moderate.message.message,
    "Unable to remove user from server, double check you have the right user."
  );
  return moderate;
};

const checkForTimeouts = ({ arg, badUser, moderator, message, ...rest }) => {
  if (badUser["status"].timeout === false) {
    message = handleError(message, "This user is not currently in timeout.");
  }
  return { arg, badUser, moderator, message, ...rest };
};

const authCommand = async ({
  arg,
  badUser,
  moderator,
  message,
  level,
  ...rest
}) => {
  const { getRobotServer } = require("../models/robotServer");
  //TEMPORARY! ONLY SERVER OWNERS CAN DO THINGS
  const server = await getRobotServer(message.server_id);
  moderator.isGlobal = checkGlobalTypes(message.badges);
  // console.log("/////////AUTH COMMAND: ", level, moderator.isGlobal);
  if (level === "global" && moderator.isGlobal === false) {
    message = handleError(
      message,
      "You are not authorized to use this command."
    );
    return { arg, badUser, moderator, message, level, ...rest };
  }

  if (moderator.user_id !== server.owner_id && level !== "global") {
    message = handleError(
      message,
      "You are not authorized to use this command."
    );
    return { arg, badUser, moderator, message, level, ...rest };
  }
  return { arg, badUser, moderator, message, level, ...rest };
};

const checkTime = ({ arg, badUser, moderator, message, ...rest }) => {
  // console.log("Check timeout time: ", arg);
  const { maxTimeout } = require("../config/server");
  let time = parseInt(arg);
  if (!Number.isInteger(time)) {
    message.message = "Integer Required for Timeout";
    message.broadcast = "self";
    message.error = true;
    return { arg, badUser, moderator, message, ...rest };
  }

  if (time < 0) time = 0;
  if (time > maxTimeout) time = maxTimeout;
  arg = Number(time * 1000);
  return { arg, badUser, moderator, message, ...rest };
};

//PARSE INPUT
const parseInput = message => {
  // console.log("Parsing Command Input", message.message);
  let arg = "";
  message.type = "moderation";
  let badUser = message.message
    .substr(1)
    .split(" ")[1]
    .toLowerCase();

  if (message.message.substr(1).split(" ")[2])
    arg = message.message
      .substr(1)
      .split(" ")[2]
      .toLowerCase();

  let moderator = {
    user_id: message.sender_id,
    server_id: message.server_id
  };
  return { arg: arg, badUser: badUser, moderator: moderator, message: message };
};

const checkGlobalTypes = typesToCheck => {
  let validate = false;
  typesToCheck.forEach(type => {
    if (type === "staff" || type === "global_moderator") validate = true;
  });
  return validate;
};

const getMembers = async ({
  arg,
  badUser,
  moderator,
  message,
  level,
  ...rest
}) => {
  // console.log("Verifying users for moderation");
  const badUsername = badUser;
  const { getIdFromUsername } = require("../models/user");
  const { getMember } = require("../models/serverMembers");

  moderator = await getMember({
    server_id: message.server_id,
    user_id: message.sender_id
  });

  //TOOD: CHECK MODERATOR ROLES, THIS SHOULD BE CHECKED BEFORE BADUSER IS SEARCHED FOR
  if (!moderator) {
    //check global type:
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
      `User ${badUsername}, does not exist, are you sure you typed it correctly?`
    );
    return { arg, badUser, moderator, message, ...rest };
  }

  badUser = await getMember({ server_id: message.server_id, user_id: badUser });
  badUser.username = badUsername;
  return { arg, badUser, moderator, message, ...rest };
};

//CHECK TIMEOUT COMMAND FOR ERRORS
const checkTimeout = ({ arg, badUser, moderator, message, ...rest }) => {
  // console.log("Checking timeout command for errors");

  //YOU CAN'T TIMEOUT JILL, DONT EVEN TRY
  if (badUser.username === "jill") {
    message = handleError(
      message,
      `${moderator.username}, how dare you timeout jill`
    );
    return { arg, badUser, moderator, message, ...rest };
  }

  //YOU CAN'T TIME YOURSELF OUT
  if (badUser.username.toLowerCase() === moderator.username.toLowerCase()) {
    message = handleError(
      message,
      `${badUser.username}, You cannot timeout yourself...`
    );
    return { arg, badUser, moderator, message, ...rest };
  }
  return { arg, badUser, moderator, message, ...rest };
};

module.exports.handleLocalUnTimeout = async ({
  arg,
  badUser,
  moderator,
  message,
  ...rest
}) => {
  const removeTimeout = await clearLocalTimeout(badUser);
  if (removeTimeout) {
    message.message = `User ${badUser.username}, your timeout status has been removed for this server.`;
  } else {
    message = handleError(message, "Unable to clear timeout for user");
  }
  return { arg, badUser, moderator, message, ...rest };
};

//Note: User refers to global user, Member refers to server member (AKA local user)
module.exports.handleLocalTimeout = async ({
  arg,
  badUser,
  moderator,
  message,
  ...rest
}) => {
  const { createTimer } = require("../modules/utilities");
  const { updateMemberStatus } = require("../models/serverMembers");
  let time = arg;
  badUser.status.timeout = true;

  if (
    badUser.status.expireTimeout &&
    badUser.status.expireTimeout > Date.now()
  ) {
    const addRemainder = Number(
      badUser.status.expireTimeout - (time + Date.now())
    );
    // console.log(
    //   "User is already timed out, checking for remainder: ",
    //   addRemainder
    // );
    if (addRemainder > 0) time = addRemainder;
  }
  badUser.status.expireTimeout = Number(Date.now() + time);
  // console.log(
  //   "TIMEOUT STATUS CHECK: ",
  //   badUser.status,
  //   badUser.status.expireTimeout - Date.now()
  // );
  let checkUpdatedStatus = await updateMemberStatus(badUser); //Member Status
  if (!checkUpdatedStatus) {
    message = handleError(message, "Unable to timeout user");
  } else {
    message.message = `User ${
      badUser.username
    } has been put in timeout for ${time / 1000} seconds.`;
    // createTimer(time, clearLocalTimeout, badUser); //TODO: Uhm, do i need a timer? Timeout should just expire, right?
  }
  return { arg, badUser, moderator, message, ...rest };
};

const clearLocalTimeout = async member => {
  // console.log("Clearing timeout for local member");
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

const localMessageRemoval = async ({ badUser }) => {
  //Get Messages from User sent on a server, set display to false for all of them;
  //Send event to update clients that messages have been removed.
  const { updateDisplayMessage } = require("../models/chatMessage");
  await updateDisplayMessage({
    sender_id: badUser.user_id,
    server_id: badUser.server_id
  });
  // console.log(scrubMessages);
  localModerationEvent({
    server_id: badUser.server_id,
    event: "remove_messages",
    user: badUser.user_id
  });
  return;
};

const localModerationEvent = data => {
  // console.log("LOCAL MODERATION EVENT", data);
  emitLocalEvent(data.server_id, "LOCAL_MODERATION", data);
};

const emitLocalEvent = (server_id, event, data) => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.server_id === server_id) {
      ws.emitEvent(event, data);
    }
  });
};

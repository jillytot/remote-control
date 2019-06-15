/*
A channel can be composed of several elements, 
like a chatroom, a video feed, and a control interface. 
Global : Robot Server : Channels : Channel Elements

Right now Chatroom is acting like a channel, but this is here to note
that needs to be changed before to much more work is done. 
*/

const { makeId, createTimeStamp } = require("../modules/utilities");

channelPrototype = {
  name: "Channel Name",
  host_id: "ID of host server",
  chat: "ID of chat to reference",
  controls: "ID of robot interface controls to reference",
  display: "ID of display to reference",
  id: "Unique ID",
  created: "timestamp - when channel was first created"
};

let activeChannels = [];

const settingsPt = {
  public: true, //Deprecate
  access: "@everyone"
};

const statusPt = {
  test_value: true
};

module.exports.createChannel = data => {
  console.log("Channel Data: ", data);

  let makeChannel = {};
  makeChannel.host_id = data.host_id;
  makeChannel.chat = checkChannelElement(data.chat);
  makeChannel.controls = checkChannelElement("");
  makeChannel.display = checkChannelElement("");
  makeChannel.name = data.name;
  makeChannel.id = `chan-${makeId()}`;
  makeChannel.created = createTimeStamp();
  makeChannel.settings = settingsPt;
  makeChannel.status = statusPt;

  console.log("Generating Channel: ", makeChannel);
  this.saveChannel(makeChannel);
  // pushToActiveChannels(makeChannel);

  return makeChannel;

  //Todo: Add channel to active server in memmory
};

const setChannelChat = channel => {
  //If channel uses an existing chat, return that id,
  //If chat doesn't exist for channel already, create one
};

//Make sure each element has a value assigned
const checkChannelElement = elementId => {
  if (elementId !== "" && elementId !== undefined) {
    return elementId;
  } else {
    return "";
  }
};

module.exports.saveChannel = async channel => {
  const db = require("../services/db");
  const {
    host_id,
    name,
    id,
    chat,
    controls,
    display,
    created,
    settings,
    status
  } = channel;
  const dbPut = `INSERT INTO channels (host_id, name, id, chat, controls, display, created, settings, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *`;
  try {
    console.log("Saving Channel: ", channel);
    const result = await db.query(dbPut, [
      host_id,
      name,
      id,
      chat,
      controls,
      display,
      created,
      settings,
      status
    ]);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getChannels = async server_id => {
  const db = require("../services/db");
  try {
    const query = `SELECT * FROM channels WHERE host_id = $1`;
    const result = await db.query(query, [server_id]);
    return result.rows;
  } catch (err) {
    const error = {
      error: "Unable to get channels from DB",
      error_message: err
    };
    console.log(error);
    return error;
  }

  //return channels belonging to a server
};

//Adds channel to a server based on server_id

module.exports.deleteChannel = channel_id => {};

/* 
Todo: 
Have server own this instead of chatroom directly
put chatroom under channels
reflect the new structure on the client side

module exports: 
channelEvents
getChannels
pushToActiveChannels
deleteChannel

*/

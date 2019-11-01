/*
A channel can be composed of several elements, 
like a chatroom, a video feed, and a control interface. 
Global : Robot Server : Channels : Channel Elements

Right now Chatroom is acting like a channel, but this is here to note
that needs to be changed before to much more work is done. 
*/

const { makeId, createTimeStamp } = require("../modules/utilities");
// const socketEvents = require("../events/events");
const { getChatRooms } = require("./chatRoom");
const { CHANNELS_UPDATED, GET_CHAT_ROOMS } = require("../events/definitions");
console.log(CHANNELS_UPDATED, GET_CHAT_ROOMS);

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

module.exports.emitEvent = (channel_id, event, data) => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.channel_id === channel_id) {
      ws.emitEvent(event, data);
    }
  });
};

module.exports.createChannel = async data => {
  console.log("Channel Data: ", data);

  if (!data.chat) {
    //TODO: Create "default chatroom" setting, and use that here instead.
    const getDefaultChat = await getChatRooms(data.host_id);
    data.chat = getDefaultChat[0].id;

    console.log(
      "No Chatroom found, adding default chat: ",
      getDefaultChat,
      data.chat
    );
  }

  let makeChannel = {};
  makeChannel.host_id = data.host_id;
  makeChannel.chat = checkChannelElement(data.chat);
  makeChannel.display = checkChannelElement("");
  makeChannel.name = data.name;
  makeChannel.id = `chan-${makeId()}`;
  makeChannel.created = createTimeStamp();
  makeChannel.settings = settingsPt;
  makeChannel.status = statusPt;

  const { createControls } = require("./controls");
  console.log("Making Controls: ", makeChannel.id);
  makeControls = await createControls({ channel_id: makeChannel.id });
  makeChannel.controls = makeControls.id;
  // makeChannel.controls = checkChannelElement("");
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
    status,
    robot
  } = channel;
  const dbPut = `INSERT INTO channels (host_id, name, id, chat, controls, display, created, settings, status, robot) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *`;
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
      status,
      robot
    ]);
    this.updateServerChannels(host_id);
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
};

module.exports.updateServerChannels = async server_id => {
  const robotServer = require("./robotServer");
  let sendData = {};
  sendData.channels = await this.getChannels(server_id);
  sendData.server_id = server_id;

  robotServer.emitEvent(server_id, CHANNELS_UPDATED, sendData);
};

//Adds channel to a server based on server_id

module.exports.deleteChannel = async (channel_id, server_id) => {
  const db = require("../services/db");
  const { tempEnsureDefaultChannel } = require("../controllers/channels");
  const remove = `DELETE FROM channels WHERE id =$1`;
  let response = {};
  try {
    const checkChannelCount = await this.getChannels(server_id);
    if (checkChannelCount && checkChannelCount.length <= 1) {
      console.log("YOU CANNOT DELETE A CHANNEL IF YOU ONLY HAVE ONE LEFT");
      console.log(checkChannelCount);
      response.status = "Error!";
      response.error =
        "You cannot delete your last remaining channel, please create another if you wish to delete this one";
      return response;
    }

    const result = await db.query(remove, [channel_id]);
    // if (result.rows[0]) {
    response.status = "success!";
    response.result = result.rows[0];
    await tempEnsureDefaultChannel(server_id, channel_id);
    this.updateServerChannels(server_id);
    return response;
    //}
  } catch (err) {
    response.error = err;
    response.status = "error!";
    console.log(response);
    return response;
  }
};

module.exports.getServerIdFromChannelId = async channel_id => {
  const db = require("../services/db");
  response = {};
  try {
    const query = "SELECT * FROM channels WHERE id = $1 LIMIT 1";
    const result = await db.query(query, [channel_id]);
    console.log(
      "Get Server ID from channel ID: ",
      channel_id,
      result.rows.length,
      result.rows
    );
    if (result.rows.length > 0) {
      response.status = "success!";
      response.result = result.rows[0].host_id;
      return response;
    } else {
      response.status = "error!";
      response.error = "Unable to find channel in database";
      return response;
    }
  } catch (err) {
    (response.status = "error!"), (response.error = err);
    return response;
  }
};

module.exports.setControls = async controlData => {
  const { sendUpdatedControls } = require("./controls");
  console.log("SET CONTROLS CHECK: ", controlData);
  //save new controls to channel
  const db = require("../services/db");
  const { channel_id, id } = controlData;
  const insert = `UPDATE channels SET controls = $1 WHERE id = $2 RETURNING *`;
  let response = {};
  try {
    const result = await db.query(insert, [id, channel_id]);
    if (result.rows[0]) {
      console.log("Controls Set: ", result.rows[0]);
      const channel_controls = result.rows[0];
      sendUpdatedControls(channel_controls.controls, channel_controls.id);
      return result.rows[0];
    } else {
      response.status = "error";
      response.error = "could not set controls for channel";
    }
  } catch (err) {
    response.status = "error";
    response.error = "could not set controls for channel";
    console.log(err.detail);
  }
};

//Get data for individual channel
module.exports.getChannel = async channel_id => {
  if (!channel_id) return { status: "error!", error: "channel ID required" };
  const db = require("../services/db");
  console.log("Fetch data for channel: ", channel_id);
  try {
    const query = `SELECT * FROM channels WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [channel_id]);
    console.log(result.rows[0]);
    if (result.rows[0]) {
      return result.rows[0];
    } else {
      return {
        status: "error!",
        error: "Unable to fetch channel with ID: ",
        channel_id
      };
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAllChannels = async () => {
  const db = require("../services/db");
  const query = `SELECT * FROM channels`;
  try {
    const result = await db.query(query);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};

//tests
//console.log(this.getChannel("chan-02063c30-01b8-4d6c-9712-0fa646bcc942"));

/*
A channel can be composed of several elements, 
like a chatroom, a video feed, and a control interface. 
Global : Robot Server : Channels : Channel Elements

Right now Chatroom is acting like a channel, but this is here to note
that needs to be changed before to much more work is done. 
*/

const { makeId } = require("../modules/utilities");

channelPrototype = {
  name: "Channel Name",
  host_id: "ID of host server",
  chat: "ID of chat to reference",
  controls: "ID of robot interface controls to reference",
  display: "ID of display to reference",
  id: "Unique ID"
};

let channels = [];
module.exports.createChannel = (server, data) => {
  let makeChannel = {};
  makeChannel.host_id = server.server_id;
  makeChannel.chat = data.chat.id;
  makeChannel.controls = "";
  makeChannel.display = "";
  makeChannel.name = data.channel_name;
  makeChannel.id = makeId();

  this.saveChannel();
  //Add channel to active server in memmory
};

module.exports.saveChannel = async channel => {
  const db = require("../services/db");
  const { host_id, name, id, chat, controls, display } = channel;
  const dbPut = `INSERT INTO chat_rooms (host_id, name, id, chat, controls, display ) VALUES($1, $2, $3, $4, $5, $6 ) RETURNING *`;
  try {
    console.log("Saving Channel: ", channel);
    await db.query(dbPut, [host_id, id, name, chat, controls, display]);
  } catch (err) {
    console.log(err);
  }
};

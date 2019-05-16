const { makeId, createTimeStamp } = require("../modules/utilities");

module.exports.createChatRoom = chat => {
  let chatRoom = {};
  chatRoom.messages = [];
  chatRoom.name = chat.name;
  chatRoom.host_id = chat.host_id;
  chatRoom.id = makeId();

  this.saveChatRoom(chatRoom);
};

//Chatroom schematic
const chatRoomPrototype = {
  name: "",
  id: "",
  host_id: "",
  messages: []
};

module.exports.saveChatRoom = async chatRoom => {
  const db = require("../services/db");
  console.log("Saving Chat Room: ", chatRoom);
  const { host_id, name, id, messages } = chatRoom;

  const dbPut = `INSERT INTO chat_rooms (host_id, name, id, messages ) VALUES($1, $2, $3, $4 ) RETURNING *`;
  try {
    await db.query(dbPut, [host_id, name, id, messages]);
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.getChatRooms = async server_id => {
  const db = require("../services/db");
  const query = `SELECT * FROM chat_rooms`;
  result = await db.query(query);
  console.log(result.rows);
  return result.rows;
};

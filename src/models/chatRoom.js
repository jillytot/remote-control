/*
A chatroom is an element of a channel, which is owned by a robot server
GLobal : Robot Server : Channel : Channel Elements > Chat Room
*/

const { makeId, createTimeStamp } = require("../modules/utilities");
const { getActiveServer } = require("./robotServer");
const { createMessage } = require("./chatMessage");

module.exports.emitEvent = (chat_id, event, data) => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.chat_id === chat_id) {
      ws.emitEvent(event, data);
    }
  });
};

module.exports.createChatRoom = (chat, channel) => {
  let makeChat = {};
  makeChat.messages = [];
  makeChat.name = channel;
  makeChat.host_id = chat.server_id;
  makeChat.id = `chat-${makeId()}`;
  makeChat.created = createTimeStamp();

  console.log("Generating Chat Room: ", makeChat, chat);
  this.saveChatRoom(makeChat);
  return makeChat;
};

//Chatroom schematic
const chatRoomPrototype = {
  name: "",
  id: "",
  host_id: "",
  messages: []
};

//TODO: Put this into some kind of global instead of here
let activeChats = [];

//This function is called once in 'src/services/server/server.js'
//Initalize all chatrooms in memmory that are stored in the DB when server starts
module.exports.initActiveChats = async () => {
  const db = require("../services/db");
  const query = `SELECT * FROM chat_rooms`;
  try {
    result = await db.query(query);
    console.log("Active Chatrooms Initialized", result.rows);
    activeChats = result.rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports.pushToActiveChats = chat => {
  activeChats.push(chat);
  console.log("Active Chats Updated: ", activeChats);
};

module.exports.getActiveChat = chatId => {
  //console.log("From Get Active Chat - chatId: ", chatId, activeChats);
  let pickChat = activeChats.filter(activeChat => activeChat.id === chatId);
  return pickChat[0];
};

module.exports.saveChatRoom = async chatRoom => {
  const db = require("../services/db");
  console.log("Saving Chat Room: ", chatRoom);
  const { host_id, name, id, messages, created } = chatRoom;

  const dbPut = `INSERT INTO chat_rooms (host_id, name, id, messages, created ) VALUES($1, $2, $3, $4, $5 ) RETURNING *`;
  try {
    await db.query(dbPut, [host_id, name, id, messages, created]);
  } catch (err) {
    console.log(err.stack);
  }
};

//Get chatrooms that belong to a robot server
module.exports.getChatRooms = async server_id => {
  console.log("Server Id from getChatRooms: ", server_id);
  const db = require("../services/db");
  const query = `SELECT name, id FROM chat_rooms WHERE host_id = $1`;
  try {
    result = await db.query(query, [server_id]);
    console.log("Get Chatrooms from DB Result:", result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

//Get a single chatroom & all its contents
module.exports.getChat = async chatId => {
  console.log("Server Id from getChatRooms: ", chatId);
  const db = require("../services/db");
  const query = `SELECT * FROM chat_rooms WHERE id = $1 LIMIT 1`;
  try {
    result = await db.query(query, [chatId]);
    console.log("Get Chat Result:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports.saveMessageToActiveChat = message => {
  const activeChat = activeChats.find(
    currentActiveChat => currentActiveChat.chat_id === message.chatId
  );
  if (!activeChat) {
    throw new Error(`Couldn't find an activeChat with id ${message.chatId}`);
  }

  activeChat.messages.push(message);
  console.log(
    "Pushed Message to Active Chat: ",
    JSON.stringify(activeChats, null, 2)
  );
};

// module.exports.getActiveChatFromServer = (serverId, chatId ) => {
//   //get the specified chatroom from the list of active servers
//   let activeServer = getActiveServer(serverId);
//   return activeServer.chatId;
// }

// module.exports.setActiveChatFromServer = () => {
//   //Once a message is added, send that to the server & update active servers
// }

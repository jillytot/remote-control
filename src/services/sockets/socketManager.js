const io = require("./sockets").io;
const { createUser, createMessage, createChat } = require("./factories");
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  USERS_UPDATED,
  LOCAL_CHAT,
  HEARTBEAT,
  MESSAGE_SENT,
  MESSAGE_RECIEVED
} = require("./events");
const ChatManager = require("./chat/chatManager");

const { heartBeat } = require("./settings");

let connectedUsers = {};
let localChat = createChat();
let heartBeatStarted = false;

let initChat = false;
let userRoom = ""; //Used to emit events to individual users

const db = require("../db/db");

module.exports = function(socket) {
  if (!heartBeatStarted) {
    beat(io);
    heartBeatStarted = true;
  }

  if (!initChat) {
    console.log("Chat Room: ", localChat.name);
    initChat = true;
  }
  //Socket will emit this message with successful connection
  //console.log("Socket Id:" + socket.id);

  socket.on(VERIFY_USER, async (data, callback) => {
    const { username } = data;

    if (isUser(connectedUsers, username)) {
      callback({ isUser: true, user: null });
    } else {
      let user = createUser({ name: username });
      callback({ isUser: false, user: user });

      //DB STUFF
      dbStore("test", "username", [username]);

      //SOCKET STUFF
      socket.user = user;
      userRoom = `${socket.user.id}`;
      socket.join(userRoom);
    }
  });

  //User connects to chat
  socket.on(USER_CONNECTED, user => {
    //Note to self: Use chat.id instead of chat name at some point
    let chat = localChat;
    connectedUsers = addUser(connectedUsers, user);
    sendMessageToChatFromUser = sendMessageToChat(user);

    io.emit(USERS_UPDATED, connectedUsers);
    socket.emit(LOCAL_CHAT, chat);
    //console.log("chat stuff: ", chat.name, chat);
    socket.join(chat.name);
  });

  socket.on(LOGOUT, user => {
    connectedUsers = removeUser(connectedUsers, user["name"]);
    io.emit(USER_DISCONNECTED, user);
    io.emit(USERS_UPDATED, connectedUsers);
    io.to(userRoom).emit(userRoom, " is no longer here yo!");
  });

  //Get Community Chat
  socket.on(LOCAL_CHAT, callback => {
    callback(localChat);
  });

  //How do i tell which user?
  socket.on("disconnect", () => {
    //console.log("Lost connection to user: ");
  });

  socket.on(HEARTBEAT, checkUser => {
    checkStatus(checkUser, userRoom);
    try {
      if (socket.user) {
        socket.user.data.status = "online";
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  });

  socket.on(MESSAGE_SENT, message => {
    try {
      let checkMessage = ChatManager(message);
      sendMessageToChatFromUser(localChat.name, checkMessage);
    } catch (err) {
      console.log("Oops: ", err);
    }
  });
};

/*
Adds user to list passed in
@param userList { object } Object with key value pairs of users
@param user { user } the user to be added to the list
@return userList { object } Object with key value pairs of users */
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

/*
Checks if the user is in the list passed in.
@param userList { object } Object with key value pairs of Users
@param username { string }
@return userList { object } Object with key value pairs of Users */
function isUser(userList, username) {
  return username in userList;
}

/*
Removes user from the list passed in
@param userList { object } Object with key value pairs of Users
@param username { string } name of user to be removed
@return userList { object } Object with key value pairs of Users */
function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

//Heartbeat
function beat(io, userRoom) {
  let timerId = setTimeout(
    (tick = () => {
      userRoom ? io.to(userRoom).emit(HEARTBEAT) : io.emit(HEARTBEAT);
      timerId = setTimeout(tick, heartBeat); // (*)
    }),
    heartBeat
  );
}

function checkStatus(checkUser, thisUser) {
  const { userId, socketId } = checkUser;
  userId ? (userId === thisUser ? userId : null) : socketId ? socketId : null;
}

/*
 * Returns a function that will take a chat id and message
 * and then emit a broadcast to the chat id.
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */

function sendMessageToChat(getSender) {
  const sender = getSender.name;
  const senderId = getSender.id;

  return (chatroom, message) => {
    console.log("Check Message: ", message);
    io.to(chatroom).emit(
      MESSAGE_RECIEVED,
      createMessage({
        message: message.message,
        sender: message.username,
        senderId: message.userId,
        type: message.type
      })
    );
  };
}

dbStore = async (table, column, values) => {
  //3rd value always needs to be an array
  const text = `INSERT INTO ${table}(${column}) VALUES($1) RETURNING *`;
  try {
    const res = await db.query(text, values);
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }
};

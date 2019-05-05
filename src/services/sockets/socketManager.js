//Import Socket.io
const io = require("./sockets").io;

//Import Socket Events
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

//Import Global Settings
const { heartBeat } = require("../../config/serverSettings");
let heartBeatStarted = false;

//Import Factories
const { createUser, createMessage, createChat } = require("./factories");
let connectedUsers = {};
let localChat = createChat();

//Import DB Stuff
const db = require("../db/db");

//Import Chat Manager, initialize other chat logic
const ChatManager = require("./chat/chatManager");
let initChat = false;
let userRoom = ""; //Used to emit events to individual users

/*
*
*
Socket Manager */
module.exports = function(socket) {
  //Initialize Heartbeat
  if (!heartBeatStarted) {
    beat(io);
    heartBeatStarted = true;
  }

  //Temporary: Initialize a chatroom
  if (!initChat) {
    console.log("Chat Room: ", localChat.name);
    initChat = true;
  }

  //When user first logs in from the client
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
Adds user to list passed in*/
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

/*
Checks if the user is in the list passed in.*/
function isUser(userList, username) {
  return username in userList;
}

/*
Removes user from the list passed in */
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
 * Returns a function that will take a chat id and message*/
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

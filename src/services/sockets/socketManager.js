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

//Bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10; //!!!!!!Don't leave this on a public repo. !!!!!!!!

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
    console.log("Verify User Data: ", data);

    if (isUser(connectedUsers, username)) {
      callback({ isUser: true, user: null });
    } else {
      let user = createUser({ name: username });

      //DB STUFF
      const dbCheck = await dbStore("test", "username", [username]);
      console.log("DB Status: ", dbCheck.status);

      //ENCRYPT PASSWORD:
      bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) console.log("Encryption Error: ", err);
        bcrypt.hash(data.password, salt, function(err, hash) {
          if (err) console.log("Encryption Error: ", err);
          // Store hash in your password DB.
          console.log("Hash: ", hash);
        });
      });

      //SOCKET STUFF
      socket.user = user;
      userRoom = `${socket.user.id}`; //Allows sending a message to a single user
      socket.join(userRoom);
      io.to(userRoom).emit(userRoom, dbCheck.status);

      callback({ isUser: false, user: user });
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
  let sendRes = { status: "" }; //return status

  const checkDb = `SELECT exists ( SELECT 1 FROM ${table} WHERE ${column} = '${values}' LIMIT 1 );`;
  const checkRes = await db.query(checkDb);
  const { exists } = checkRes.rows[0];

  try {
    if (exists === false) {
      const text = `INSERT INTO ${table}(${column}) VALUES($1) RETURNING *`;
      try {
        const res = await db.query(text, values);
        console.log("db insertion result: ", res.rows[0]);
        sendRes.status = "New account created!";
      } catch (err) {
        console.log(err.stack);
      }
    } else {
      // console.log("This user already exists in DB");
      sendRes.status = "This username already exists, please try another";
    }
  } catch (err) {
    console.log(err.stack);
  }
  return sendRes;
};

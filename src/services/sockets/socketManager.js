const io = require("./sockets").io;
const { createUser, createMessage, createChat } = require("./factories");
const {
  TEST_EVENT,
  TEST_RESPONSE,
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  USERS_UPDATED,
  LOCAL_CHAT,
  HEARTBEAT
} = require("./events");

const { heartBeat } = require("./settings");

let connectedUsers = {};
let localChat = createChat();

module.exports = function(socket) {
  //Socket will emit this message with successful connection
  //console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    console.log("Test Event Recieved");
    const beep = "beep";
    io.emit(TEST_RESPONSE, testResponse(beep));
  });

  socket.on(VERIFY_USER, (data, callback) => {
    console.log(data);
    const { username } = data;

    if (isUser(connectedUsers)) {
      //console.log("verifying user");
      callback({ isUser: true, user: null });
    } else {
      //console.log("Add User! ", username);
      callback({ isUser: false, user: createUser({ name: username }) });
      //console.log("Connected Users: ", connectedUsers);
    }
  });

  socket.on(USER_CONNECTED, user => {
    connectedUsers = addUser(connectedUsers, user);
    io.emit(USERS_UPDATED, connectedUsers);
    //console.log("Connected Users: ", connectedUsers);
  });

  socket.on(LOGOUT, user => {
    connectedUsers = removeUser(connectedUsers, user["name"]);
    io.emit(USER_DISCONNECTED, user);
    io.emit(USERS_UPDATED, connectedUsers);
    //console.log("Disconnect", user, "User List UpdateD: ", connectedUsers);
  });

  //Get Community Chat
  socket.on(LOCAL_CHAT, callback => {
    //console.log("community chat: ", communityChat);
    callback(localChat);
  });

  //How do i tell which user?
  socket.on("disconnect", () => {
    console.log("Lost connection to user: ");
  });

  socket.on(HEARTBEAT, user => {
    console.log("heartbeat from: ", user);
  });
};

function testResponse(test) {
  console.log("Test Response Sent: ", test);
  return test;
}

/*
Adds user to list passed in
@param userList { object } Object with key value pairs of users
@param user { user } the user to be added to the list
@return userList { object } Object with key value pairs of users */
function addUser(userList, user) {
  console.log("Add User: ", userList, user);
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
  //console.log("Removing ", username, " from userlist: ", userList);
  return newList;
}

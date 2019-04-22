const io = require("./sockets").io;
const { createUser, createMessage, createChat } = require("./factories");
const { TEST_EVENT, TEST_RESPONSE, VERIFY_USER } = require("./events");

let connectedUsers = {};
module.exports = function(socket) {
  //Socket will emit this message with successful connection
  console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    console.log("Test Event Recieved");
    const beep = "beep";
    io.emit(TEST_RESPONSE, testResponse(beep));
  });

  socket.on(VERIFY_USER, (data, callback) => {
    console.log(data);
    const { username } = data;

    if (isUser(connectedUsers)) {
      console.log("verifying user");
      callback({ isUser: true, user: null });
    } else {
      console.log("Add User! ", username);
      callback({ isUser: false, user: createUser({ name: username }) });
      console.log("Connected Users: ", connectedUsers);
    }
  });
};

function testResponse(test) {
  console.log("Test Response Sent: ", test);
  return test;
}

/*
Checks if the user is in the list passed in.
@param userList { object } Object with key value pairs of Users
@param username { string }
@return userList { object } Object with key value pairs of Users */
function isUser(userList, username) {
  return username in userList;
}

//Import Socket.io
const io = require("./sockets").io;

const authenticate = require("./authenticate");

socket.on("AUTHENTICATE", data => {
  authenticate(data);
});

/*
Authorize user & subscribe to self
VERIFY_USER, token => {
socket.user = user.verifyAuthToken(token);
const userRoom = `${socket.user.id}`; //Allows sending a message to a single user
socket.join(userRoom);
io.to(userRoom).emit(userRoom, dbCheck.status);
}

LOGOUT
CREATE_SERVER
DELETE_SERVER
 */

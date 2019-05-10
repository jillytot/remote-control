//Import Socket.io
const io = require("./sockets").io;

const authenticate = require("./authenticate");

socket.on("AUTHENTICATE", data => {
  authenticate(socket, data);
});

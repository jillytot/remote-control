const io = require("./sockets").io;

module.exports = function(socket) {
  socket.user = "username";

  //Join a unique room per user
  //Join genral rooms for common chat n stuff
  socket.join("room");

  socket.on("USER_LOGIN", username => {
    socket.join(`user-${username}`);
  });
  io.to(`user-usernametosendto`).emit("event");

  //io - server messages, socket - single connection messages
};

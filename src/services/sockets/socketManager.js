const io = require("./sockets").io;

module.exports = function(socket) {
  // console.log('\x1bc'); //clears console
  console.log("Socket Id:" + socket.id);
};

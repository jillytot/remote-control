const io = require("./sockets").io;
const { TEST_EVENT } = require("./events");
module.exports = function(socket) {
  console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    console.log("Test Event Recieved");
  });
};

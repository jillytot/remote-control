const io = require("./sockets").io;
const { TEST_EVENT } = require("./events");
module.exports = function(socket) {
  console.log("Socket Id:" + socket.id);

  let beep = "beep";

  socket.on(TEST_EVENT, () => {
    io.emit(TEST_EVENT, beep);
  });
};

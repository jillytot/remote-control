const io = require("./sockets").io;
import { TEST_EVENT } from "./events";

module.exports = function(socket) {
  // console.log('\x1bc'); //clears console
  console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    io.emit(TEST_EVENT, "Beep!");
  });
};

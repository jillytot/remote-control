const io = require("./sockets").io;
const { TEST_EVENT, TEST_RESPONSE } = require("./events");
module.exports = function(socket) {
  console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    console.log("Test Event Recieved");
    socket.emit(TEST_RESPONSE, testResponse("beep!"));
  });
};

function testResponse(test) {
  return console.log("Test Response Sent: ", test);
}

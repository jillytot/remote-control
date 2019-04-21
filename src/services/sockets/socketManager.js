const io = require("./sockets").io;
const { createUser, createMessage, createChat } = require("./factories");
const { TEST_EVENT, TEST_RESPONSE } = require("./events");

module.exports = function(socket) {
  //Socket will emit this message with successful connection
  console.log("Socket Id:" + socket.id);

  socket.on(TEST_EVENT, () => {
    console.log("Test Event Recieved");
    const beep = "beep";
    socket.emit(TEST_RESPONSE, testResponse(beep));
  });
};

function testResponse(test) {
  console.log("Test Response Sent: ", test);
  return test;
}

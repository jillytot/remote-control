const user = require("../models/user");
const test = require("../services/server/server.js");
// const { io } = require("../services/server/server");
console.log(test);

module.exports.socketEvents = (socket, io) => {
  socket.on("AUTHENTICATE", async data => {
    console.log("AUTHENTICATING!", data);

    let verify = false;

    const getUser = await user.verifyAuthToken(data.token);

    if (getUser !== null && getUser !== undefined) {
      // console.log("verification complete!", getUser);
      verify = true;

      socket.user = getUser;
      const userRoom = `${socket.user.id}`;
      socket.join(userRoom);
      io.to(userRoom).emit(userRoom, verify);
    }
  });
};

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

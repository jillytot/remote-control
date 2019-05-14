const user = require("../models/user");
const test = require("../services/server/server.js");
console.log(test);

module.exports.socketEvents = (socket, io) => {
  socket.on("AUTHENTICATE", async data => {
    let verify = false;
    const getUser = await user.verifyAuthToken(data.token);
    if (getUser !== null && getUser !== undefined) {
      console.log("verification complete!", getUser);
      verify = true;

      //setup private user sub for user events
      socket.user = getUser;
      const userRoom = `${socket.user.id}`;
      socket.join(userRoom);

      //Confirm Validation:
      io.to(userRoom).emit("VALIDATED", {
        username: getUser.username,
        id: getUser.id
      });
    }
  });

  //More socket Events
};

/*
User has a websocket

User is authenticated separately via the API

Authenticated user needs to subscribe websocket events




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

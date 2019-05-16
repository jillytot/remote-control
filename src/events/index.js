const user = require("../models/user");
const { getChatRooms, getChat } = require("../models/chatRoom");
const { getActiveServer, addActiveUser } = require("../models/robotServer");
const {
  GET_CHAT_ROOMS,
  DISPLAY_CHAT_ROOMS,
  AUTHENTICATE,
  VALIDATED,
  GET_CHAT,
  SEND_CHAT
} = require("../services/sockets/events").socketEvents;

module.exports.socketEvents = (socket, io) => {
  let userRoom = "";
  socket.on(AUTHENTICATE, async data => {
    let verify = false;
    const getUser = await user.verifyAuthToken(data.token);
    if (getUser !== null && getUser !== undefined) {
      //console.log("verification complete!", getUser);
      verify = true;

      //setup private user sub for user events
      socket.user = getUser;
      userRoom = `${socket.user.id}`;
      socket.join(userRoom);

      //Confirm Validation:
      io.to(userRoom).emit(VALIDATED, {
        username: getUser.username,
        id: getUser.id
      });
    }
  });

  socket.on(GET_CHAT_ROOMS, async data => {
    addActiveUser(data.user, data.robot_server);
    socket.join(data.robot_server);
    io.to(userRoom).emit(
      DISPLAY_CHAT_ROOMS,
      await getChatRooms(data.robot_server)
    );

    // addUser(data.user, data.robot_server);
    // let clients = io.sockets.clients(data.robot_server);
    //get selected chats from DB
    // Add users to the server
    // console.log(data);
  });

  socket.on(GET_CHAT, async chatId => {
    console.log("GET CHAT Chat Id: ", chatId);
    io.to(userRoom).emit(SEND_CHAT, await getChat(chatId));

    //Subscribe user to chat
    //return chat
  });

  //More socket Events
};

// const serverEvents = new ServerEvents();
// serverEvents.on("event", () => {
//   console.log("an event occurred!");
// });
// serverEvents.emit("event");

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

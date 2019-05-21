const user = require("../models/user");
const { getChatRooms, getChat, chatEvents } = require("../models/chatRoom");
const { createMessage } = require("../models/chatMessage");
const { getActiveServer, addActiveUser } = require("../models/robotServer");
const {
  GET_CHAT_ROOMS,
  SEND_ROBOT_SERVER_INFO,
  AUTHENTICATE,
  VALIDATED,
  GET_CHAT,
  SEND_CHAT
} = require("../services/sockets/events").socketEvents;

//Main websocket Interface
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

  socket.on("MESSAGE_SENT", message => {
    console.log("Message Received: ", message);
    createMessage(message);
  });

  //Send list of chatrooms to user, subscribe user to robot server events
  socket.on(GET_CHAT_ROOMS, async data => {
    console.log("GET CHAT ROOMS: ", data);
    await addActiveUser(data.user, data.server_id);
    socket.join(data.robot_server);
    io.to(userRoom).emit(SEND_ROBOT_SERVER_INFO, {
      channels: await getChatRooms(data.server_id),
      users: await getActiveServer(data.server_id).users
      //chatRoom: await getChatRooms(data.server_id)
    });

    io.of("/")
      .in(data.robot_server)
      .clients((error, clients) => {
        if (error) throw error;

        // Returns an array of client IDs like ["Anw2LatarvGVVXEIAAAD"]
        //No clue what to do with this
        console.log("Active Users from Server: ", clients);
        clients.map(client => {
          console.log(client);
        });
      });
  });

  //Subscribe user to a specified chatroom, and send them all the specific info about it
  socket.on(GET_CHAT, async chatId => {
    console.log("GET CHAT Chat Id: ", chatId);
    io.to(userRoom).emit(SEND_CHAT, await getChat(chatId));

    //Subscribe user to chat
    const chatRoom = `${chatId}`;
    socket.join(chatRoom);
    console.log(
      `Subbing user: ${socket.user.username} to chatroom: ${chatRoom}`
    );
    chatEvents(chatRoom, socket);
  });

  //More socket Events
};

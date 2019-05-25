const user = require("../models/user");
const { getChatRooms, getChat, chatEvents } = require("../models/chatRoom");
const { createMessage } = require("../models/chatMessage");
const {
  GET_CHAT_ROOMS,
  SEND_ROBOT_SERVER_INFO,
  AUTHENTICATE,
  VALIDATED,
  GET_CHAT,
  SEND_CHAT,
  MESSAGE_SENT
} = require("../services/sockets/events").socketEvents;

const { sendActiveUsers } = user;

//Main websocket Interface
module.exports.socketEvents = (socket, io) => {
  let userRoom = "";
  socket.on(AUTHENTICATE, async data => {
    const getUser = await user.authUser(data.token);
    if (getUser) {
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

  socket.on(MESSAGE_SENT, message => {
    console.log("Message Received: ", message);
    if (socket.user && socket.user.type) message.userType = socket.user.type;
    createMessage(message);
  });

  //Send list of chatrooms to user, subscribe user to robot server events
  socket.on(GET_CHAT_ROOMS, async data => {
    console.log("GET CHAT ROOMS: ", data);
    socket.join(data.server_id);
    const sendInfo = {
      channels: await getChatRooms(data.server_id),
      users: await sendActiveUsers(data.server_id)
      //chatRoom: await getChatRooms(data.server_id)
    };
    io.to(userRoom).emit(SEND_ROBOT_SERVER_INFO, sendInfo);
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

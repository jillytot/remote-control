const user = require("../models/user");
const { getChatRooms, getChat, chatEvents } = require("../models/chatRoom");
const { createMessage } = require("../models/chatMessage");
const { getChannels } = require("../models/channel");
const {
  SEND_ROBOT_SERVER_INFO,
  AUTHENTICATE,
  VALIDATED,
  GET_CHAT,
  SEND_CHAT,
  MESSAGE_SENT,
  HEARTBEAT,
  BUTTON_COMMAND,
  GET_CHANNELS,
  JOIN_CHANNEL
} = require("./events").socketEvents;

const { sendActiveUsers } = user;

const { heartBeat } = require("../config/serverSettings");
let heartBeatStarted = false;

//Main websocket Interface
module.exports.socketEvents = (socket, io) => {
  if (!heartBeatStarted) {
    beat(io);
    heartBeatStarted = true;
  }

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

  //ROBOT COMMAND HANDLING
  socket.on(BUTTON_COMMAND, command => {
    console.log("NEW COMMAND: ", command);
    const { publicUser } = user;
    const { tempCommandValidation } = require("../models/controls");
    command.user = publicUser(socket.user);
    if (tempCommandValidation(command.button)) {
      io.to(command.channel).emit(BUTTON_COMMAND, command);
    }

    //No voting yet,
  });

  //Send list of chatrooms to user, subscribe user to robot server events
  socket.on(GET_CHANNELS, async data => {
    console.log("GET CHAT ROOMS: ", data);
    socket.join(data.server_id);
    const sendInfo = {
      channels: await getChannels(data.server_id),
      users: await sendActiveUsers(data.server_id)
      //chatRoom: await getChatRooms(data.server_id)
    };
    //io.to(userRoom).emit(SEND_ROBOT_SERVER_INFO, sendInfo);
    socket.emit(SEND_ROBOT_SERVER_INFO, sendInfo);
  });

  socket.on(JOIN_CHANNEL, async channel_id => {
    console.log("JOIN CHANNEL: ", channel_id);
    socket.join(channel_id);
  });
  //Subscribe user to a specified chatroom, and send them all the specific info about it
  socket.on(GET_CHAT, async chatId => {
    console.log("GET CHAT Chat Id: ", chatId);
    //io.to(userRoom).emit(SEND_CHAT, await getChat(chatId));
    socket.emit(SEND_CHAT, await getChat(chatId));

    //Subscribe user to chat
    const chatRoom = `${chatId}`;
    socket.join(chatRoom);
    console.log(
      `Subbing user: ${socket.user.username} to chatroom: ${chatRoom}`
    );
    chatEvents(chatRoom, socket);
  });

  //More socket Events
  connectedUsers(socket);
};

const beat = io => {
  let timerId = setTimeout(
    (tick = () => {
      io.emit(HEARTBEAT);
      timerId = setTimeout(tick, heartBeat); // (*)
    }),
    heartBeat
  );
};

const connectedUsers = socket => {
  socket.on(HEARTBEAT, user => {
    console.log("Connected User: ", user);
  });
};

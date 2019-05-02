//Original Reference: https://github.com/vlw0052/Tutorial---ReactJS-and-Socket.io-Chat-App/blob/master/src/Factories.js
const uuidv4 = require("uuid/v4");
const { heartBeat } = require("./settings");

const createUser = ({ name = "" } = {}) => ({
  id: uuidv4(),
  name,
  data: {
    status: "",
    heartBeat: heartBeat,
    created: createTimeStamp()
  }
});

const createMessage = ({
  message = "",
  sender = "",
  senderId = "",
  type = ""
} = {}) => ({
  id: uuidv4(),
  time: createTimeStamp(),
  message,
  sender,
  senderId,
  display: true,
  type
});

const createChat = ({ messages = [], name = "", users = [] } = {}) => ({
  id: uuidv4(),
  name: "Robo Chat",
  messages,
  users,
  typingUsers: []
});

const createRobot = ({
  owner = "",
  ownerId,
  name = "",
  id = "",
  commands = []
} = {}) => ({
  id: uuidv4(),
  name,
  owner,
  ownerId,
  commands
});

const createServer = ({
  owner = "",
  ownerId = "",
  id = "",
  name = "",
  members = []
} = {}) => ({
  id: uuidv4(),
  name,
  owner,
  ownerId,
  members
});

const getTime = date => {
  return `${("0" + (date.getMonth() + 1)).slice(-2)}/${(
    "0" + date.getDate()
  ).slice(-2)}/${date.getFullYear()}-${date.getHours()}:${(
    "0" + date.getMinutes()
  ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;
};

//Using millis for now instead because i think it makes easier math
const createTimeStamp = () => {
  return Date.now();
};

module.exports = {
  createMessage,
  createChat,
  createUser,
  createRobot,
  createServer
};

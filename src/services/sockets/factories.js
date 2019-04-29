//Original Reference: https://github.com/vlw0052/Tutorial---ReactJS-and-Socket.io-Chat-App/blob/master/src/Factories.js
const uuidv4 = require("uuid/v4");
const { heartBeat } = require("./settings");

/*
 *	createUser
 *	Creates a user.
 *	@prop id {string}
 *	@prop name {string}
 *	@param {object}
 *		name {string}

 *  status:  online, idle, offline, hidden
 */

const createUser = ({ name = "" } = {}) => ({
  id: uuidv4(),
  name,
  data: {
    status: "",
    heartBeat: heartBeat,
    created: getTime(new Date(Date.now()))
  }
});

/*
 *	createMessage
 *	Creates a messages object.
 * 	@prop id {string}
 * 	@prop time {Date} the time in 24hr format i.e. 14:22
 * 	@prop message {string} actual string message
 * 	@prop sender {string} sender of the message
 *	@param {object}
 *		message {string}
 *		sender {string}
 */
const createMessage = ({ message = "", sender = "", senderId = "" } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender,
  senderId
});

/*
 *	createChat
 *	Creates a Chat object
 * 	@prop id {string}
 * 	@prop name {string}
 * 	@prop messages {Array.Message}
 * 	@prop users {Array.string}
 *	@param {object}
 *		messages {Array.Message}
 *		name {string}
 *		users {Array.string}
 *
 */
const createChat = ({ messages = [], name = "", users = [] } = {}) => ({
  id: uuidv4(),
  name: "Robo Chat",
  messages,
  users,
  typingUsers: []
});

/*
 *	@param date {Date}
 *	@return a string represented in 24hr time i.e. '11:30', '19:30'
 */
const getTime = date => {
  return `${date.getHours()}:${("0" + date.getMinutes()).slice(-2)}`;
};

module.exports = {
  createMessage,
  createChat,
  createUser
};

user_prototype = {
  id: 000000,
  username: "user9000",
  sessions: [],
  rooms: [
    { room_id: 9592345, roomName: "chatroom", room_icon: "/imgs/roomIcon" }
  ],
  _settings: [{ chat_filter: true }]
};

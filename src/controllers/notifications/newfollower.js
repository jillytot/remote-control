module.exports = (server, follower) => {
  const { createMessage } = require("../../models/chatMessage");
  const { alertMessages } = require("./");
  //Todo: Check server settings for printing new follower to chat
  //Todo: Check user settings for emailing follower alerts

  const { username } = follower;
  const alert = alertMessages(username);
  createMessage({
    message: alert,
    user: follower,
    server_id: server.server_id,
    type: "event",
    broadcast: "server"
  });
};

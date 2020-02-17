module.exports = (server, follower) => {
  const { createMessage } = require("../../models/chatMessage");
  //Todo: Check server settings for printing new follower to chat
  //Todo: Check user settings for emailing follower alerts

  const { username } = follower;
  const alert = alertMessages(username);
  createMessage({
    message: alert,
    user: follower,
    server_id: server.server_id,
    type: "moderation",
    broadcast: "server"
  });
};

const alertMessages = username => {
  alerts = [`${username} has joined the server!`];
  return alerts[0];
};

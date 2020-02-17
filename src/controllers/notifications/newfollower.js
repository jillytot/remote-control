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
    type: "event",
    broadcast: "server"
  });
};

const alertMessages = username => {
  alerts = [
    `${username} has joined the server!`,
    `Dont panic! ${username} has joined the server`,
    `${username} has arrived, resistance is futile.`,
    `${username} has hacked into the mainframe.`,
    `${username} detected, raising shields.`,
    `${username} is now one of us! One of us!`,
    `${username} just joined, 10/10 would join again.`,
    `Welcome ${username}, robotYay robotHi`
  ];
  const randomIndex = Math.floor(Math.random() * Math.floor(alerts.length));
  return alerts[randomIndex];
};

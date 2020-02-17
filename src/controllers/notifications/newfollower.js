module.exports = async (server, follower) => {
  const { createMessage } = require("../../models/chatMessage");
  const { alertMessages } = require("./");
  const { getRobotServerSettings } = require("../../models/robotServer");
  //Todo: Check server settings for printing new follower to chat
  const { settings } = await getRobotServerSettings(server.server_id);
  //
  if (settings.announce_followers_in_chat !== false) {
    const { username } = follower;
    const alert = alertMessages(username);
    createMessage({
      message: alert,
      user: follower,
      server_id: server.server_id,
      type: "event",
      broadcast: "server"
    });
  }

  //Todo: Check user settings for emailing follower alerts
};

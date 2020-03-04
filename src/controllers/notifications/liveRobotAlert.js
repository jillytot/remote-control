module.exports = async robot => {
  const { createMessage } = require("../../models/chatMessage");
  const { robotAlerts } = require("./");
  const { getRobotServerSettings } = require("../../models/robotServer");
  const { notifyFollowers } = require("./");
  //Todo: Check server settings for printing new follower to chat
  const { settings } = await getRobotServerSettings(robot.host_id);

  console.log("/////////LIVE ROBOT UP/////////!", robot.name);
  //
  if (settings.announce_followers_in_chat !== false) {
    const alert = robotAlerts(robot.name);
    createMessage({
      message: alert,
      user: robot,
      server_id: robot.host_id,
      type: "event",
      broadcast: "server"
    });
  }

  //notify followers:
  notifyFollowers(robot.host_id);
  //Todo: Check user settings for emailing follower alerts
};

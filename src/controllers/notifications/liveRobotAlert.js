module.exports = async robot => {
  const { createMessage } = require("../../models/chatMessage");
  const { robotAlerts } = require("./");
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../../models/robotServer");
  const { notifyFollowers } = require("./");
  const { emailNotificationInterval } = require("../../config/server");

  let { settings, status } = await getRobotServer(robot.host_id);

  //Add Announce Robot setting
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

  const time = Date.now();
  //TODO: send email notification setting ( server side )
  if (
    !status.notification_sent ||
    status.notification_sent > time + emailNotificationInterval
  ) {
    notifyFollowers(robot.host_id);
    settings.notification_sent = time;
    updateRobotServerSettings(settings);
  }
};

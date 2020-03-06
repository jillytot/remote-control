module.exports = async robot => {
  const { getRobotFromId } = require("../../models/robot");
  const { createMessage } = require("../../models/chatMessage");
  const { robotAlerts } = require("./");
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../../models/robotServer");
  const { notifyFollowers } = require("./");
  const { emailNotificationInterval } = require("../../config/server");

  let { settings, status, server_name } = await getRobotServer(robot.host_id);

  //Add Announce Robot setting
  if (settings.announce_followers_in_chat !== false) {
    const alertMessage = robotAlerts(robot.name);
    createMessage({
      message: alertMessage,
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
    const getRobot = await getRobotFromId(robot.id);
    const { current_channel } = getRobot.status;
    const linkChannel = current_channel || settings.default_channel;
    notifyFollowers(robot.host_id, server_name, linkChannel, robot.name);
    settings.notification_sent = time;
    updateRobotServerSettings(settings);
  }
};

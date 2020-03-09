module.exports = async robot => {
  const { getRobotFromId } = require("../../models/robot");
  const { createMessage } = require("../../models/chatMessage");
  const { robotAlerts } = require("./");
  const {
    getRobotServer,
    updateRobotServerStatus
  } = require("../../models/robotServer");
  const { notifyFollowers } = require("./");
  const { emailNotificationInterval } = require("../../config/server");

  let { settings, status, server_name, owner_id } = await getRobotServer(
    robot.host_id
  );

  //TODO: Setting specifically for annoucing live robots in chat
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
  console.log("GETTING READY TO SEND NOTIFICATION!, ");
  if (status.notification_sent)
    console.log(
      "Interval: ",
      emailNotificationInterval,
      "Notification Sent + Interval: ",
      status.notification_sent + emailNotificationInterval,
      "Current Time: ",
      time
    );

  if (
    !status.notification_sent ||
    time > status.notification_sent + emailNotificationInterval
  ) {
    const getRobot = await getRobotFromId(robot.id);
    const { current_channel } = getRobot.status;
    const linkChannel = current_channel || settings.default_channel;
    notifyFollowers(
      robot.host_id,
      server_name,
      linkChannel,
      robot.name,
      owner_id
    );
    status.notification_sent = time;
    updateRobotServerStatus(robot.host_id, status);
  } else {
    console.log("NOTIFICATION NOT SENT!");
  }
};

module.exports = async (server_id, server_name, channel_id, robot_name) => {
  const { getMemberAndUserSettings } = require("../../models/mixedQueries");
  const { emailLiveRobotAnnoucemnent } = require("../../controllers/mailers");
  const { robotAlerts } = require("./");

  if (!server_name || !robot_name || !channel_id) return;

  const members = await getMemberAndUserSettings(server_id);
  const alert = robotAlerts(robot_name, server_name);
  //
  console.log("Sending notifications to members: ");
  members.forEach(member => {
    if (
      (member.member_settings.hasOwnProperty("enable_notifications") &&
        member.member_settings.enable_notifications === false) ||
      (member.status.hasOwnProperty("email_verified") &&
        member.status.email_verified === false) ||
      (member.status.hasOwnProperty("enable_email_notifications") &&
        member.status.enable_email_notifications === false)
    ) {
      return;
    }

    emailLiveRobotAnnoucemnent(member, {
      server_name: server_name,
      channel_id: channel_id,
      robotAlert: alert
    });
  });
  return;
  //get the user for each member,
  //filter for verified email address & global notification settings
};

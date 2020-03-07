module.exports = async (
  server_id,
  server_name,
  channel_id,
  robot_name,
  owner_id
) => {
  const { getMemberAndUserSettings } = require("../../models/mixedQueries");
  const { emailLiveRobotAnnoucemnent } = require("../../controllers/mailers");
  const { robotAlerts } = require("./");

  if (!server_name || !robot_name || !channel_id) return;

  const members = await getMemberAndUserSettings(server_id);
  const alert = robotAlerts(robot_name, server_name);
  //
  //   console.log("Sending notifications to members: ");
  members.forEach(member => {
    let send = true;

    if (member.id === owner_id) send = false;
    if (send && member.member_status.member === false) send = false;

    if (
      send &&
      member.member_settings.hasOwnProperty("enable_notifications") &&
      member.member_settings.enable_notifications === false
    )
      send = false;

    if (
      send &&
      member.status.hasOwnProperty("email_verified") &&
      member.status.email_verified === false
    )
      send = false;

    if (
      send &&
      member.settings.hasOwnProperty("enable_email_notifications") &&
      member.settings.enable_email_notifications === false
    )
      send = false;

    if (send)
      emailLiveRobotAnnoucemnent(member, {
        server_name: server_name,
        channel_id: channel_id,
        robotAlert: alert
      });
  });
  return;
};

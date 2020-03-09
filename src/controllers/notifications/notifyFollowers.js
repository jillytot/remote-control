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
  const { enableEmailAlerts } = require("../../config/server");

  if (!server_name || !robot_name || !channel_id) return;

  const members = await getMemberAndUserSettings(server_id);
  const alert = robotAlerts(robot_name, server_name);
  //
  //   console.log("Sending notifications to members: ");
  if (enableEmailAlerts)
    // members.forEach(member => {
    //   if (
    //     member.id !== owner_id &&
    //     member.status.email_verified &&
    //     (member.member_settings.enable_notifications ||
    //       !member.member_settings.hasOwnProperty("enable_notifications")) &&
    //     (member.settings.enable_email_notifications ||
    //       !member.settings.hasOwnProperty("enable_email_notifications"))
    //   ) {
    //     emailLiveRobotAnnoucemnent(member, {
    //       server_name: server_name,
    //       channel_id: channel_id,
    //       robotAlert: alert
    //     });
    //   }
    // });
    return;
};

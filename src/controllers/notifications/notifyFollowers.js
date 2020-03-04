module.exports = async server_id => {
  const { getMemberAndUserSettings } = require("../../models/mixedQueries");
  const members = await getMemberAndUserSettings(server_id);
  //
  console.log("Sending notifications to members: ");
  members.forEach(member => {
    if (
      (member.member_settings.hasOwnProperty("enable_notifications") &&
        member.member_settings.enable_notifications === false) ||
      (member.status.hasOwnProperty("email_verified") &&
        member.status.email_verified === false)
    ) {
      return null;
    }
    console.log("Send Notification to member: ", member.username);
  });
  return;
  //get the user for each member,
  //filter for verified email address & global notification settings
};

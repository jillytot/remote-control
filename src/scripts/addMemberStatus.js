const { updateMemberStatus, getMembers } = require("../models/serverMembers");
const { getRobotServers } = require("../models/robotServer");

const updateMembership = async () => {
  const servers = await getRobotServers();
  await servers.forEach(async server => {
    const members = await getMembers(server.server_id);
    console.log("MEMBERS CHECK: ", members);
    if (members.error) {
    } else {
      await members.map(async member => {
        console.log("UPDATING MEMBER: ", member);
        if (Object.keys(!member.status.member)) {
          member.status.member = false;
          await updateMemberStatus(member);
        }
      });
    }
  });
};

updateMembership();

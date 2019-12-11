const {
  getAllMembers,
  updateUsername,
  updateJoined
} = require("../models/serverMembers");
const { getUserInfoFromId } = require("../models/user");

const update = async () => {
  const members = await getAllMembers();
  console.log(members.length);
  for (const member of members) {
    const getUser = await getUserInfoFromId(member.user_id);
    console.log("USER FOUND: ", getUser.username);
    if (getUser) {
      const updateMember = {
        user_id: member.user_id,
        server_id: member.server_id,
        username: getUser.username
      };
      let updated = await updateUsername(updateMember);
      if (member.joined === null) {
        updated = await updateJoined({
          user_id: member.user_id,
          server_id: member.server_id,
          joined: Date.now()
        });
      }
      console.log("User Updated: ", updated.username, updated.joined);
    } else {
      console.log("oops...");
    }
  }
  process.exit();
};

update();

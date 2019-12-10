const { getAllMembers, updateUsername } = require("../models/serverMembers");
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
      const updated = await updateUsername(updateMember);
      console.log("User Updated: ", updated.username);
    } else {
      console.log("oops...");
    }
  }
  process.exit();
};

update();

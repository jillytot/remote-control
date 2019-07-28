module.exports.followedServers = async user => {
  const { getFollowedServers } = require("../models/serverMembers");
  const checkFollowed = await getFollowedServers(user.id);
  let followed = [];
  checkFollowed.forEach(server => {
    if (server.status.member === true) followed.push(server.server_id);
  });
  console.log(followed);
  return followed;
};

module.exports.setNewPassword = async (user_id, password) => {
  const { hash } = require("../modules/utilities");
  const { updatePassword } = require("../models/user");
  password = await hash(password);
  result = await updatePassword({ id: user_id, password: password });
  return result;
};

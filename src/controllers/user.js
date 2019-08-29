module.exports.followedServers = async user => {
  const { getFollowedServers } = require("../models/serverMembers");
  const { getServerGroup } = require("../models/robotServer");
  const checkFollowed = await getFollowedServers(user.id);
  let followed = [];
  if (checkFollowed) {
    checkFollowed.forEach(server => {
      if (server.status.member === true) followed.push(server.server_id);
    });
    followed = await getServerGroup(followed);
  }
  return followed;
};

module.exports.setNewPassword = async (user_id, password) => {
  const { hash } = require("../modules/utilities");
  const { updatePassword } = require("../models/user");
  password = await hash(password);
  result = await updatePassword({ id: user_id, password: password });
  return result;
};

module.exports.passwordResetKey = (user, setExpire) => {
  const { makeId, createTimeStamp } = require("../modules/utilities");
  const { passResetExpires } = require("../config/serverSettings");
  const handleExpire = setExpire;
  return {
    key_id: `rset-${makeId()}`,
    created: createTimeStamp(),
    expires: passResetExpires,
    ref: user.id,
    expire: handleExpire() || false,
    setExpiration: setExpire => handleExpire(setExpire)
  };
};

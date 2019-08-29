const { err } = require("../modules/utilities");

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

const passwordResetKey = (user, setExpire) => {
  const { makeId, createTimeStamp } = require("../modules/utilities");
  const { passResetExpires } = require("../config/serverSettings");
  let expire = false;
  const handleExpire = setExpire => {
    expire = setExpire;
  };
  return {
    key_id: `rset-${makeId()}`,
    created: createTimeStamp(),
    expires: passResetExpires,
    ref: user.id,
    expire: expire,
    setExpiration: setExpire => handleExpire(setExpire)
  };
};

module.exports.resetPassword = async user => {
  const { saveKey } = require("../models/keys");
  if (user) {
    const makeKey = await passwordResetKey(user);
    const save = await saveKey(makeKey);
    console.log("Key Result: ", save);
    return save;
  }
  return err("Unable to generate key.");
};

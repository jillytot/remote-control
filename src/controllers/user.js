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

module.exports.generateResetKey = async user => {
  const { saveKey } = require("../models/keys");
  if (user) {
    const makeKey = await passwordResetKey(user);
    const save = await saveKey(makeKey);
    console.log("Key Result: ", save);
    return save;
  }
  return err("Unable to generate key.");
};

module.exports.useResetKey = async (user, key, pass) => {
  const { updatePassword } = require("../models/user");
  const { getKey, updateKey } = require("../models/keys");
  user.passsword = pass;
  const checkExpired = await getKey(key);
  if (checkExpired.expired === true) {
    return err(
      "This key is no longer valid, please request a new password reset"
    );
  }
  const useKey = await updateKey({
    user_id: user.id,
    key_id: key.key_id,
    expired: true
  });
  if (!useKey) return err("There was a problem finding the specified key");
  const reset = await updatePassword(user);
  if (!reset) return err("Could not reset password");
  return reset;
};

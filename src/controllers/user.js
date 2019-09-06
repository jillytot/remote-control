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
  const handleExpire = () => {
    expire = setExpire;
  };
  return {
    key_id: `rset-${makeId()}`,
    created: createTimeStamp(),
    expires: passResetExpires,
    ref: user.id,
    expire: expire,
    setExpiration: value => handleExpire(value)
  };
};

module.exports.generateResetKey = async user => {
  const { saveKey } = require("../models/keys");
  if (user) {
    const makeKey = await passwordResetKey(user);
    const save = await saveKey(makeKey);
    return save;
  }
  return err("Unable to generate key.");
};

module.exports.validateResetKey = async ({ key_id }) => {
  const { getKey } = require("../models/keys");
  const validate = await getKey({ key_id: key_id });
  if (validate) return validate;
  return err("Invalid Key");
};

module.exports.useResetKey = async ({ key_id, password }) => {
  console.log("RESET KEY CONTROLLER: ", key_id, password);
  const { getKey, updateKey } = require("../models/keys");
  const { getUserInfoFromId, createAuthToken } = require("../models/user");
  const { expired, expires, ref } = await getKey({ key_id });
  console.log("GET KEY: ", expired, expires, Date.now());
  if (expired === true || expired === "true" || expires <= Date.now()) {
    return err(
      "This key is not valid, either it doesn't exist, or it could have expired. Please request a new password reset"
    );
  }
  let getUser = await getUserInfoFromId(ref);
  if (!getUser) return null;
  const reset = await this.setNewPassword(getUser.id, password);
  if (reset) {
    const useKey = await updateKey({
      key_id: key_id,
      ref: getUser.id,
      expired: true
    });
    if (!useKey) return err("There was a problem updating your key");
  }
  if (!reset) return err("Could not reset password");
  const token = await createAuthToken(getUser);
  return { token: token };
};

const { err } = require("../modules/utilities");
const { jsonError } = require("../modules/logging");

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
  const { passResetExpires } = require("../config/server");
  let expire = false;
  const handleExpire = () => {
    expire = setExpire || Date.now() + passResetExpires;
  };
  return {
    key_id: `rset-${makeId()}`,
    created: createTimeStamp(),
    expires: setExpire || Date.now() + passResetExpires,
    ref: user.id,
    expire: expire,
    setExpiration: value => handleExpire(value)
  };
};

module.exports.emailResetToken = async username => {
  const { getInfoFromUsername } = require("../models/user");
  const { generateResetKey } = require("./user");
  const user = await getInfoFromUsername(username);
  if (user) {
    const reset = await generateResetKey(user, {}, true);
    if (reset.error) return err("Server Error, unable to generate key");
  }
  return {
    response:
      "A reset token has been sent to the email account associated with this username."
  };
};

module.exports.generateResetKey = async (user, setExpire, emailKey) => {
  const { saveKey } = require("../models/keys");
  const { emailResetKey } = require("./mailers");
  if (user) {
    const makeKey = await passwordResetKey(user, setExpire);
    //TODO: Consider ensuring that a user can only have one active reset key at a time
    const save = await saveKey(makeKey);
    if (emailKey === true) emailResetKey(user, save);
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

module.exports.checkUsername = async name => {
  const { checkUsername } = require("../models/user");
  const check = await checkUsername(name);
  if (check) return check;
  return null;
};

module.exports.getPublicUserFromId = async user_id => {
  const { getUserInfoFromId } = require("../models/user");
  const user = await getUserInfoFromId(user_id);
  if (user) return user;
  return jsonError("Unable to get user information");
};

module.exports.fetchProfileInfo = async user_id => {
  const { getPrivateInfoFromId } = require("../models/user");
  const { getPatron } = require("../models/patreon");
  let info = await getPrivateInfoFromId(user_id);
  const checkPatreon = await getPatron({ user_id });
  // console.log("CHECK PATREON: ", checkPatreon);
  //check for Patreon Link
  if (info.error) return info;
  info = privateInfo(info);
  if (checkPatreon) {
    // console.log("PATREON INFO FOUND!");
    info.patreon_id = checkPatreon.patreon_id;
    info.active_rewards = checkPatreon.active_rewards;
    // console.log(info);
  }
  return info;
};

const privateInfo = info => {
  return {
    username: info.username,
    email: info.email,
    id: info.id,
    created: info.created,
    settings: info.settings,
    type: info.type,
    status: info.status
  };
};

module.exports.updateEmail = async ({ email, id }) => {
  const { checkEmail, updateEmail } = require("../models/user");
  const { validateUserEmail } = require("./validate");

  let input = validateUserEmail(email);
  if (input.error) return input;

  const checkForDupes = await checkEmail({ email: input });
  if (checkForDupes) {
    console.log("CHECK FOR EMAIL DUPES: ", input, checkForDupes);
    return jsonError("This email is already in use, please try another.");
  } else {
    const update = await updateEmail({ email: input, id: id });
    if (update) {
      await this.resetVerifiedEmailStatus(update);
      return privateInfo(update);
    } else {
      return jsonError("Unable to update email, please try again later");
    }
  }
};

module.exports.resetVerifiedEmailStatus = async user => {
  const { updateStatus } = require("../models/user");
  user.status.email_verified = false;
  const update = await updateStatus(user);
  if (update) {
    return true;
  }
  return null;
};

module.exports.updateUserSettings = async user => {
  const { updateSettings, getPrivateInfoFromId } = require("../models/user");
  let getUser = await getPrivateInfoFromId(user.id);

  if (user.settings.hasOwnProperty("enable_email_notifications")) {
    getUser.settings.enable_email_notifications =
      user.settings.enable_email_notifications;
  }

  const update = await updateSettings(getUser);
  if (update) return update;
  return jsonError(
    "Unable to update settings for user, please try again later."
  );
};

/**
 * PART 1: KEY GENERATION
 * Input From: src/routes/api/user.js
 */
module.exports.validateEmail = async (user, setExpire) => {
  const { getPrivateInfoFromId } = require("../models/user");
  const { saveKey } = require("../models/keys");
  const { emailValidationKey } = require("./mailers");

  const getUser = await getPrivateInfoFromId(user.id);

  //Check validation status:
  if (getUser && getUser.status && getUser.status.email_validated) {
    //Should I resend?
    return {
      result: "This email address has already been validated"
    };
  }

  //Generate Validation Key
  const makeKey = await generateKey(user, setExpire);
  if (makeKey.error) return makeKey;
  const save = await saveKey(makeKey);
  if (save.error) return save;

  //email Key:
  await emailValidationKey(getUser, save);

  return {
    result:
      "A validation link has been sent to the email address associated with this account."
  };
};

const generateKey = (user, setExpire) => {
  const { makeId, createTimeStamp } = require("../modules/utilities");
  const { emailValidationExpires } = require("../config/server");
  let expire = false;
  const handleExpire = () => {
    expire = setExpire || Date.now() + emailValidationExpires;
  };
  return {
    key_id: `mail-${makeId()}`,
    created: createTimeStamp(),
    expires: setExpire || Date.now() + emailValidationExpires,
    ref: user.id,
    expire: expire,
    setExpiration: value => handleExpire(value)
  };
};

/**
 * Part II:  Use Validation Key
 * Input from: /src/routes/api/user
 */
module.exports.useEmailValidationKey = async key => {
  const { updateStatus, getUserInfoFromId } = require("../models/user");
  const { updateKey } = require("../models/keys");
  const { supportEmail } = require("../config/server");

  //Match key to DB, return error if not valid
  let getKey = await this.validateKey(key);
  if (getKey.error) return getKey;

  //If key is valid, match key ref to user:
  let user = await getUserInfoFromId(getKey.ref);
  if (!user || (user && user.error))
    return jsonError(
      "Error matching key to user, please request a new validation link"
    );

  //Update user status and expire the key
  user.status.email_validated = true;
  getKey.expired = true;
  const updateUser = await updateStatus(user);
  const expireKey = await updateKey(getKey);
  if (!updateUser || !expireKey)
    return jsonError(
      `There was a problem validating this key, please try again, or contact ${supportEmail} for help.`
    );

  //
  return { email_validated: true };
};

//Check if Key exists
module.exports.validateKey = async ({ key_id }) => {
  const { getKey } = require("../models/keys");
  const { jsonError } = require("../modules/logging");
  const validate = await getKey({ key_id: key_id });
  if (validate) return validate;
  return jsonError("Invalid Key");
};

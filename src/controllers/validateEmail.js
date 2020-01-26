/**
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
  emailValidationKey(getUser, save);

  return {
    result:
      "An email validation link has been sent to the email associated with this account."
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

//Check if Key exists
module.exports.validateKey = async ({ key_id }) => {
  const { getKey } = require("../models/keys");
  const { jsonError } = require("../modules/logging");
  const validate = await getKey({ key_id: key_id });
  if (validate) return validate;
  return jsonError("Invalid Key");
};

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
    //No need to validate
  }

  //Generate Validation Key
  const makeKey = await generateKey(user, setExpire);
  if (makeKey.error) return makeKey;
  const saveKey = await saveKey(makeKey);
  if (saveKey.error) return saveKey;

  //email Key:
  emailValidationKey(getUser, saveKey);

  return {
    response:
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
  const validate = await getKey({ key_id: key_id });
  if (validate) return validate;
  return err("Invalid Key");
};

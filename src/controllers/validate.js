const {
  checkMax,
  checkMin,
  checkString,
  checkAlphaNum_,
  removeSpaces
} = require("../modules/validation");
const { jsonError } = require("../modules/logging");

module.exports.validateServerName = name => {
  const keyName = "Server name";
  if (!checkString(name)) return jsonError("Wrong data type, string required.");
  name = removeSpaces(name);
  if (!checkMax(name, 18))
    return jsonError(
      `${keyName} can be no longer than ${18} characters in length`
    );
  if (!checkMin(name, 4))
    return jsonError(`${keyName} must be at least ${4} characters in length`);
  if (!checkAlphaNum_(name))
    return jsonError(
      `${keyName} can only contain letters, numbers, and underscores.`
    );
  return name;
};

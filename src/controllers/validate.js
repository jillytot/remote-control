const { checkType } = require("../modules/validation");
const { jsonError } = require("../modules/logging");
const { alphaNum_, emailRegex } = require("../modules/getRegex");

module.exports.validateServerName = input => {
  return this.validator({
    input: input,
    label: "Server Name",
    max: 18,
    min: 4,
    removeSpaces: true
  });
};

module.exports.validateUserName = input => {
  return this.validator({
    input: input,
    label: "UserName",
    max: 18,
    min: 4,
    removeSpaces: true
  });
};

module.exports.validateChannelName = input => {
  return this.validator({
    input: input,
    label: "Channel Name",
    max: 18,
    min: 3,
    removeSpaces: true
  });
};

module.exports.validateRobotName = input => {
  return this.validator({
    input: input,
    label: "Robot Name",
    max: 18,
    min: 3,
    removeSpaces: true
  });
};

module.exports.validateUserEmail = input => {
  return this.validator({
    input: input,
    label: "Email",
    max: 32,
    min: 5,
    removeSpaces: true,
    regex: emailRegex,
    regexInfo: "Valid Email Format"
  });
};

module.exports.validator = (
  { input, label, type, max, min, regex, removeSpaces } = {
    label: label || "Input",
    type: type || "string",
    regex: regex || alphaNum_,
    regexInfo: regexInfo || "Letters, Numbers, and Underscores"
  }
) => {
  let updateInput = input;
  if (!input) {
    return jsonError(`A value is required for ${label}`);
  }

  if (type & !checkType(input, type)) {
    return jsonError(`Wrong data type, ${type} required.`);
  }

  if (removeSpaces) {
    //  console.log("NO SPACES: ", input);
    updateInput = updateInput.replace(/\s+/g, "");
    //  console.log("NO SPACES RESULT: ", input);
  }

  if (regex && !regex.test(input)) {
    return jsonError(`${label} can only contain ${regexInfo}.`);
  }

  if (max && input.length > max) {
    return jsonError(
      `${label} can be no longer than ${max} characters in length.`
    );
  }

  if (min && input.length < min) {
    return jsonError(`${label} must be at least ${min} characters in length`);
  }

  return updateInput;
};

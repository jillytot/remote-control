const { checkType } = require("../modules/validation");
const { jsonError } = require("../modules/logging");
const { alphaNum_ } = require("../modules/getRegex");

module.exports.validateServerName = input => {
  return this.validator({
    input: input,
    label: "Server Name",
    max: 18,
    min: 4
  });
};

module.exports.validateUserName = input => {
  return this.validator({
    input: input,
    label: "UserName",
    max: 18,
    min: 4
  });
};

module.exports.validateChannelName = input => {
  return this.validator({
    input: input,
    label: "Channel Name",
    max: 18,
    min: 3
  });
};

module.exports.validateRobotName = input => {
  return this.validator({
    input: input,
    label: "Robot Name",
    max: 18,
    min: 4
  });
};

module.exports.validator = (
  { input, label, type, max, min, regex, options } = {
    label: label || "Input",
    type: type || "string",
    options: options || "no_spaces",
    regex: {
      value: regex.value || alphaNum_,
      info: regex.info || "Letters, Numbers, and Underscores"
    }
  }
) => {
  if (!input) {
    return jsonError(`A value is required for ${label}`);
  }

  if (type & !checkType(input, type)) {
    return jsonError(`Wrong data type, ${type} required.`);
  }

  if (options && options === "no_spaces") {
    input = noSpaces(input);
  }

  if (regex && !regex.value.test(input)) {
    return jsonError(`${label} can only contain ${regex.info}.`);
  }

  if (max && input.length > max) {
    return jsonError(
      `${label} can be no longer than ${max} characters in length.`
    );
  }

  if (min && input.length < min) {
    return jsonError(`${label} must be at least ${min} characters in length`);
  }

  return input;
};

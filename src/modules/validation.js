const getRegex = require("./getRegex");

module.exports.checkMax = (input, limit) => {
  if (input.length > limit) return false;
  return true;
};

module.exports.checkMin = (input, limit) => {
  if (input.length < limit) return false;
  return true;
};

module.exports.checkType = (input, type) => {
  if (typeof input !== type) return false;
  return true;
};

module.exports.checkString = input => {
  if (typeof input !== "string") return false;
  return true;
};

module.exports.checkAlphaNum_ = input => {
  if (!getRegex.alphaNum_.test(input)) return false;
  return true;
};

module.exports.checkASCII = input => {
  if (!getRegex.asciiRegex.test(input)) return false;
  return true;
};

module.exports.removeSpaces = input => {
  return input.replace(/\s+/g, "");
};

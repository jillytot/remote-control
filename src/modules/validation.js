const { jsonError } = require("./logging");
const getRegex = require("./getRegex");

// class Validation {
//   constructor(input) {
//     console.log("INPUT: ", input);
//     this.value = input;
//   }

//   get val() {
//     return this.value;
//   }

//   typeString() {
//     const { value } = this;
//     if (typeof value !== "string") {
//       this.error = "Invalid data type. Input must be a string";
//       return this;
//     }
//     return this.value;
//   }

// typeString() {
//   if (typeof this.value !== "string") {
//     this.error = "Invalid data type. Input must be a string";
//     return this.error;
//   } else {
//     return this.value;
//   }
// }

//   noSpaces() {
//     this.value.replace(/\s+/g, "");
//     console.log("Removing Spaces: ", this.value);
//     return this;
//   }
// }

// module.exports = Validation;

//OR ...

// module.exports.noSpaces = (str, next) => {
//   if (str.error) return str;
//   str = str.replace(/\s+/g, "");
//   next ? next(str) : str;
// };

// module.exports.maxChar = (input, limit, next) => {
//   if (input.error) return input;
//   console.log("Check Max Char: ", input, limit);
//   if (input.length > limit)
//     return jsonError(`Input value cannot exceed ${limit} characters`);
//   next ? next(input) : input;
// };

// module.exports.minChar = (input, limit, next) => {
//   if (input.error) return input;
//   console.log("Check Min Char: ", input, limit);
//   if (input.length < limit)
//     return jsonError(`Input length must be a minimum of ${limit} characters`);
//   next ? next(input) : input;
// };

// //Alphanumeric + Underscore
// module.exports.alphaNum_ = (input, next) => {
//   if (input.error) return input;
//   console.log("Check AlphaNum_: ", input);
//   if (!getRegex.alphaNum_.test(input))
//     return jsonError(
//       "Input can only contain alphanumeric characters, or underscore."
//     );
//   if (next) return next(input);
//   console.log("no next input: ", input);
//   return input;
// };

// module.exports.email = (input, next) => {
//   if (input.error) return input;
//   if (!getRegex.emailRegex.test(input))
//     return jsonError("Invalid Email Address");
//   next ? next(input) : input;
// };

// module.exports.typeString = (input, next) => {
//   if (input.error) return input;
//   console.log("Check String Input: ", input);
//   if (typeof input !== "string")
//     return jsonError("Invalid data type. Input must be a string");
//   next ? next(input) : input;
// };

//method 3, stupid simple

module.exports.checkMax = (input, limit) => {
  if (input.length > limit) return false;
  return true;
};

module.exports.checkMin = (input, limit) => {
  if (input.length < limit) return false;
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

module.exports.removeSpaces = input => {
  return input.replace(/\s+/g, "");
};

const globalBadWordsList = require("./globalBadWordsList.json");
const metaphone = require("metaphone");

const phoneticBadWords = Object.keys(globalBadWordsList.phonetic_bad_words);
const replacementWords = Object.values(globalBadWordsList.phonetic_bad_words);

/**
 * Scan the message for offending phonetic matches and replace them with a
 * substitute.
 *
 * @param {String} payload the message/username/any string to scan
 * @example
 *  // Filter a chat message
 *  chatMessage = filterMessage(chatMessage);
 *
 * @returns {String} the string but with any matching phonics replaced with family friendly fun time
 */
module.exports.filterMessage = payload => {
  let returnPayload = "";
  // Split the payload at each space. Also works for single word payloads.
  const words = payload.split(" ");
  // iterate through the message for bad words
  words.forEach(word => {
    const idx = phoneticBadWords.indexOf(metaphone(word));
    if (idx >= 0) { // substitute as needed
      returnPayload += replacementWords[idx] + " ";
    } else {
      returnPayload += word + " ";
    }
  });
  return returnPayload.trim();
};

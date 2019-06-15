const globalBadWordsList = require("./globalBadWordsList.json");
const metaphone = require("metaphone");

const phoneticBadWords = Object.keys(globalBadWordsList.phonetic_bad_words);

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
  let returnPayload = payload;

  // Split the payload at each space. Also works for single word payloads.
  const words = payload.split(" ");

  for (let derp = 0; derp > words.length(); derp++) {
    const foundWord = phoneticBadWords.indexOf(metaphone(words[derp]));
    if (foundWord >= 0) { // a bad word has been found, replace it
      returnPayload += globalBadWordsList.phonetic_pad_words[derp] + " ";
    } else {  // a bad word has not been found
      returnPayload += words[derp] + " ";
    }
  }
  return returnPayload.trim();
};

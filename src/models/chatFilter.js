const globalBadWordsList = require("./globalBadWordsList.json");

/**
 * Scan the message for offending phonetic matches and replace them with a
 * substitute. Ideal for TTS.
 *
 * @param {String} payload the message/username/any string to scan
 * @example
 *  // Filter a chat message
 *  chatMessage = filterPhoneticMessage(chatMessage);
 *
 * @returns {String} the string but with any matching phonics replaced with family friendly fun time
 */
module.exports.filterPhoneticMessage = payload => {
  const metaphone = require("metaphone");
  const phoneticBadWords = Object.keys(globalBadWordsList.phonetic_bad_words);
  const replacementWords = Object.values(globalBadWordsList.phonetic_bad_words);
  let returnPayload = "";
  // Split the payload at each space. Also works for single word payloads.
  const words = payload.split(" ");
  // iterate through the message for bad words
  words.forEach(word => {
    const idx = phoneticBadWords.indexOf(metaphone(word));
    if (idx >= 0) {
      // substitute as needed
      returnPayload += replacementWords[idx] + " ";
    } else {
      returnPayload += word + " ";
    }
  });
  return returnPayload.trim();
};

/**
 * Scan the payload for offending strict matches and replace them with a 
 * substitute. 
 * @param {String} payload the message/username/chat message to scan
 * @example
 *  // filter a username
 *  username = filterTextMessage(username);
 * 
 * @returns {String} the censored payload.
 */
module.exports.filterTextMessage = payload => {
  let returnPayload = "";
  /** @TODO split on any non-word character */
  const messageSplit = payload.split(" ");
  const badWords = Object.values(globalBadWordsList.normal_bad_words);
  const replacements = Object.keys(globalBadWordsList.normal_bad_words);

  messageSplit.forEach(word => {
    let index = -1;

    badWords.forEach((words, idx) => {
      if (words.indexOf(word) >= 0) {
        index = idx;
      }
    });

    if (index >= 0) {
      returnPayload = returnPayload.concat(' ', replacements[index]);
    } else {
      returnPayload = returnPayload.concat(' ', word);
    }
  });

  return returnPayload.trim();
};

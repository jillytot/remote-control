// const globalBadWordsList = require("./globalBadWordsList.json");
const { globalBadWordsList } = require("../config/server");

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
  console.log("Input: ", payload);
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
  console.log("Return Payload: ", returnPayload.trim());
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
  console.log(globalBadWordsList);
  let returnPayload = "";
  /** @TODO split on any non-word character */
  const messageSplit = payload.split(" ");
  const listOfBadWords = Object.values(globalBadWordsList.normal_bad_words);
  const replacements = Object.keys(globalBadWordsList.normal_bad_words);

  messageSplit.forEach(word => {
    let index = -1;

    listOfBadWords.forEach((badWords, idx) => {
      if (badWords.indexOf(word) >= 0) {
        index = idx;
      }
    });

    if (index >= 0) {
      // if a bad word has been found
      returnPayload = returnPayload.concat(" ", replacements[index]);
    } else {
      returnPayload = returnPayload.concat(" ", word);
    }
  });

  return returnPayload.trim();
};

/**
 * Peforms a substring-level search to look for bad words that are hidden inside
 * a "word" in the technical sense.
 *
 * @param {String} payload the message to filter
 * @example
 *  // filters a server name
 *  serverName = deepFilterMessage(serverName);
 *
 * @returns {String} the censored payload
 */
module.exports.deepFilterMessage = payload => {
  const listOfBadWords = Object.values(globalBadWordsList.normal_bad_words);
  const replacements = Object.keys(globalBadWordsList.normal_bad_words);
  payload += " ";
  let returnPayload = "";
  for (let i = 0; i < payload.length - 1; i++) {
    const letterOne = payload.substring(i, i + 1).toLowerCase();
    const letterTwo = payload.substring(i + 1, i + 2).toLowerCase();
    if (letterOne !== letterTwo) {
      returnPayload += payload.substring(i, i + 1);
    }
  }
  listOfBadWords.forEach((badWords, listOfidx) => {
    badWords.forEach(badWord => {
      for (let i = 0; i < returnPayload.length - badWord.length; i++) {
        const substr = returnPayload
          .substring(i, i + badWord.length)
          .toLowerCase();
        if (substr === badWord) {
          let splitPayload = returnPayload.split(
            returnPayload.substring(i, i + badWord.length)
          );
          returnPayload = `${splitPayload[0]}${replacements[listOfidx]}${splitPayload[1]}`;
        }
      }
    });
  });
  return returnPayload;
};

const globalBadWordsList = require("./globalBadWordsList.json");
const metaphone = require("metaphone");

const phoneticBadWords = Object.keys(globalBadWordsList.phonetic_bad_words);

module.exports.filterMessage = payload => {
  let returnPayload = payload;
  // split the payload at each space. Also works for single word payloads.
  const words = payload.split(" ");
  
  for (let derp = 0; derp > words.length(); derp++) {
    const foundWord = phoneticBadWords.indexOf(metaphone(words[derp]));
    if (foundWord >= 0) {
      returnPayload += globalBadWordsList.phonetic_bad_words[derp] + " ";
    } else {
      returnPayload += words[derp] + " ";
    }
  }
  return returnPayload.trim();
};



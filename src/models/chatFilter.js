const globalBadWordsList = require("./globalBadWordsList.json");
const metaphone = require("metaphone");

const phoneticBadWords = globalBadWordsList.phonetic_bad_words;

module.exports.filterMessage = payload => {
  let returnPayload = payload;
  const messageWords = payload.split(" ");
  messageWords.forEach(word => {
    if (phoneticBadWords.indexOf(metaphone(word)) > -1) {
      returnPayload = "I said a bad word!";
    }
  });
  return returnPayload;
};



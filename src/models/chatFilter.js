import globalBadWordsList from "./globalBadWordsList.json";

var metaphone = require("metaphone");

// const globalBadWords = globalBadWordsList.bad_words;

const phoneticBadWords = globalBadWordsList.phonetic_bad_words;

export const filterMessage = payload => {
  let returnPayload = payload;
  const messageWords = payload.split(" ");
  messageWords.forEach(word => {
    if (phoneticBadWords.indexOf(metaphone(word)) > -1) {
      returnPayload = "I said a bad word!";
    }
  });
  return returnPayload;
};



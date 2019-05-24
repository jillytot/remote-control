import globalBadWordsList from "./globalBadWordsList.json";

var metaphone = require("metaphone");

// const globalBadWords = globalBadWordsList.bad_words;

const phoneticBadWords = globalBadWordsList.phonetic_bad_words;

export const filterMessage = payload => {
  console.log("phonetic bad words: ", phoneticBadWords)
  const messageWords = payload.split(" ");
  messageWords.forEach(word => {
    console.log("phonetic word: ", metaphone(word));
    if (phoneticBadWords.indexOf(metaphone(word)) > -1) {
      console.log("phonetic filter match!");
      return "/me said a bad word!";
    }
  });
  return payload;
};

export default filterMessage;

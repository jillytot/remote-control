import globalBadWordsList from "./globalBadWords.json";

const globalBadWords = globalBadWordsList.bad_words;

export const filterMessage = payload => {
  const badWords = Object.keys(globalBadWords);
  const replacementWords = Object.values(globalBadWords);
  let censoredMessage = "";
  const messageWords = payload.split(" ");
  messageWords.forEach(word => {
    if (badWords.indexOf(word) > -1) {
      censoredMessage += `${replacementWords[badWords.indexOf(word)]} `;
    } else {
      censoredMessage += `${word} `;
    }
  });
  if (censoredMessage !== payload) payload = censoredMessage;

  return payload;
}

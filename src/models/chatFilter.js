import globalBadWordsList from "./globalBadWords.json";

const globalBadWords = globalBadWordsList.bad_words;

export const filterMessage = message => {
  const badWords = Object.keys(globalBadWords);
  const replacementWords = Object.values(globalBadWords);
  let censoredMessage = "";
  const messageWords = message.message.split(" ");
  messageWords.forEach(word => {
    if (badWords.indexOf(word) > -1) {
      censoredMessage += `${replacementWords[badWords.indexOf(word)]} `;
    } else {
      censoredMessage += `${word} `;
    }
  });
  if (censoredMessage !== message.message) message.message = censoredMessage;

  return message;
}

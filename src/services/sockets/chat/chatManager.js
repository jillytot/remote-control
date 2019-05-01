module.exports = message => {
  const command = RegExp("/");

  console.log(message.message.charAt(0));
  if (message.message.charAt(0) === "/") message.type = "site-command";
  if (message.message.charAt(0) === ".") message.type = "robot-command";
  if (message.message.charAt(0) === "#") message.type = "donate";

  const commands = doCommand => {
    console.log("Do Command!");
    let scrubCommand = doCommand
      .substr(1)
      .split(" ")[0]
      .toLowerCase();

    if (scrubCommand === "me") message.type = "self";
    console.log("Do Command: ", scrubCommand);
  };
  if (message.type === "site-command") commands(message.message);

  console.log(message);
  return message;
};

// var words = codelines[i].split(" ");
//   firstWords.push(words[0]);

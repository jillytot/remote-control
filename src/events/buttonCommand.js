const user = require("../models/user");
const { BUTTON_COMMAND } = require("./definitions");

module.exports = async (ws, command) => {
  if (!ws.user) return;
  const channel = require("../models/channel");
  //console.log("NEW COMMAND: ", command);
  const { publicUser } = user;
  const { validateInput } = require("../models/controls");
  command.user = publicUser(ws.user);

  if (await validateInput(command)) {
    console.log(
      "CHECK WS VALIDATE COMMAND INPUT",
      command.user.username,
      command.button.label
    );
    channel.emitEvent(command.channel, BUTTON_COMMAND, command);
  }
};

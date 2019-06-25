const user = require("../models/user");
const { BUTTON_COMMAND } = require("./definitions");

module.exports = async (ws, command) => {
  if (!ws.user) return;
  const channel = require("../models/channel");
  console.log("NEW COMMAND: ", command);
  const { publicUser } = user;
  const { validateInput } = require("../models/controls");
  command.user = publicUser(ws.user);

  if (await validateInput(command)) {
    channel.emitEvent(command.channel, BUTTON_COMMAND, command);
  }
};

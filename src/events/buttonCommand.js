const user = require("../models/user");
const { BUTTON_COMMAND } = require("./definitions");

module.exports = (ws, command) => {
  const channel = require("../models/channel");
  console.log("NEW COMMAND: ", command);
  const { publicUser } = user;
  const { tempCommandValidation } = require("../models/controls");
  command.user = publicUser(ws.user);
  if (tempCommandValidation(command.button)) {
    channel.emitEvent(command.channel, BUTTON_COMMAND, command);
  }
};

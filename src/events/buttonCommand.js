const user = require("../models/user");

module.exports = (ws, command) => {
  console.log("NEW COMMAND: ", command);
  const { publicUser } = user;
  const { tempCommandValidation } = require("../models/controls");
  command.user = publicUser(ws.user);
  if (tempCommandValidation(command.button)) {
    // TODO: io.to(command.channel).emit(BUTTON_COMMAND, command);
  }
};

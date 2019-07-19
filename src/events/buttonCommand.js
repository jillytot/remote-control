const user = require("../models/user");
const { BUTTON_COMMAND } = require("./definitions");

module.exports = async (ws, command) => {
  if (!ws.user) return;
  const channel = require("../models/channel");
  const { publicUser } = user;
  const { validateInput } = require("../models/controls");
  command.user = publicUser(ws.user);
  console.log("USER FROM WS", ws.user, "COMMAND: ", command);

  if (
    !ws.user.localStatus ||
    ws.user.localStatus.server_id !== command.server
  ) {
    const {
      checkMembership,
      createMember
    } = require("../models/serverMembers");
    let getLocalStatus = await checkMembership({
      server_id: command.server,
      user_id: ws.user.id
    });
    if (!getLocalStatus) {
      getLocalStatus = await createMember({
        user_id: user_id,
        server_id: server_id
      });
    }
    ws.user.localStatus = getLocalStatus.status;
  }

  if (ws.user.status.timeout === true || ws.user.localStatus.timeout === true)
    return;

  if (await validateInput(command)) {
    console.log(
      "CHECK WS VALIDATE COMMAND INPUT",
      command.user.username,
      command.button.label
    );
    channel.emitEvent(command.channel, BUTTON_COMMAND, command);
  }
};

const { getControls } = require("../models/controls");
const { getControlsFromId } = require("../controllers/controls");
const { logger } = require("../modules/logging");
const log = message => {
  return {
    level: "debug",
    source: "events/getControls.js",
    message: message
  };
};

module.exports = async (ws, channel) => {
  logger({
    level: "debug",
    source: "events/getControls.js",
    message: `SUBBING USER TO CONTROLS: ${channel.id}`
  });

  if (channel && channel.controls) {
    const controls = await getControls(channel.controls);
    ws.emitEvent(
      "GET_USER_CONTROLS",
      await getControlsFromId(controls.channel_id, ws.user)
    );
    //Subscribe user to controls
    ws.controls_id = channel.controls;
    if (ws.user) {
      log(`Subbing user: ${ws.user.username} to controls: ${channel.controls}`);
    } else if (ws.robot) {
      log(`Subbing robot: ${ws.robot.id} to controls: ${channel.controls}`);
    }
  } else {
    log(
      `NO CONTROLS IDENTIFIED FOR CHANNEL ${channel.name}, creating new controls!`
    );
  }
};

const { getControls } = require("../models/controls");
const { getControlsFromId } = require("../controllers/controls");

module.exports = async (ws, channel) => {
  console.log("SUBBING USER TO CONTROLS, Channel's Controls: ", channel);

  if (channel && channel.controls) {
    const controls = await getControls(channel.controls);
    ws.emitEvent(
      "GET_USER_CONTROLS",
      await getControlsFromId(controls.channel_id, ws.user)
    );
    //Subscribe user to controls
    ws.controls_id = channel.controls;
    if (ws.user) {
      console.log(
        `Subbing user: ${ws.user.username} to controls: ${channel.controls}`
      );
    } else if (ws.robot) {
      console.log(
        `Subbing robot: ${ws.robot.id} to controls: ${channel.controls}`
      );
    }
  } else {
    console.log(
      `NO CONTROLS IDENTIFIED FOR CHANNEL ${channel.name}, creating new controls!`
    );
  }
};

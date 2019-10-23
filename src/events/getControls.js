// const { getControls } = require("../models/controls");
const { getControlsFromId } = require("../controllers/controls");
const { getChannel } = require("../models/controls");

module.exports = async (ws, channel_id) => {
  console.log("SUBBING USER TO CONTROLS, Controls Id: ", channel_id);

  if (channel_id) {
    // const controls = await getControls(controls_id);
    const controls = await getChannel(channel_id);
    ws.emitEvent(
      "GET_USER_CONTROLS",
      await getControlsFromId(controls.controls, ws.user)
    );
    //Subscribe user to controls
    ws.controls_id = controls_id;
    if (ws.user) {
      console.log(
        `Subbing user: ${ws.user.username} to controls: ${controls_id}`
      );
    } else if (ws.robot) {
      console.log(`Subbing robot: ${ws.robot.id} to controls: ${controls_id}`);
    }
  }
};

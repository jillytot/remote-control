const { getControls } = require("../models/controls");
const { getControlsFromId } = require("../controllers/controls");

module.exports = async (ws, controls_id) => {
  console.log("SUBBING USER TO CONTROLS, Controls Id: ", controls_id);

  if (controls_id) {
    const controls = await getControls(controls_id);
    ws.emitEvent(
      "CONTROLS_UPDATED",
      await getControlsFromId(controls.channel_id, ws.user)
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

const robot = require("../models/robot");

module.exports = async (ws, data) => {
  const getRobot = await user.authRobot(data.token);
  if (getRobot) {
    //setup private user sub for user events
    ws.robot = getRobot;
    console.log("AUTH ROBOT: ", getRobot);

    //Confirm Validation:
    ws.emitEvent("ROBOT_VALIDATED", robot);
  }
};

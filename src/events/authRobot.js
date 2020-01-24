const robot = require("../models/robot");
const { logger } = require("../modules/logging");
const log = message => {
  logger({
    message: message,
    level: "debug",
    source: "events/joinChannel.js"
  });
};

module.exports = async (ws, data) => {
  const getRobot = await robot.authRobot(data.token);
  if (getRobot) {
    //setup private user sub for user events
    ws.robot = getRobot;

    log("AUTH ROBOT: ", getRobot.name);

    //Confirm Validation:
    ws.emitEvent("ROBOT_VALIDATED", {
      id: getRobot.id,
      host: getRobot.host_id
    });
  }
};

let robots = [];
let prevBots = [];
const { logger } = require("../modules/logging");
const log = message => {
  logger({
    message: message,
    level: "debug",
    source: "controllers/robot.js"
  });
};

module.exports.robotStatus = async () => {
  const { updateRobotServer } = require("../models/robotServer");
  const { checkForLiveRobots } = require("../controllers/robotServer");
  prevBots = robots;
  robots = await getLiveRobots();
  console.log("Checking Live Robots");
  await updateRobotStatus(robots);
  await checkForLiveRobots();
  updateRobotServer(); //only send update event on changes
  checkInterval();
};

module.exports.updateChannelStatus = async ({ robot, channel_id }) => {
  const { updateRobotStatus } = require("../models/robot");
  log(`Update current channel for robot: ${robot.name}, ${channel_id}`);
  robot.status.current_channel = channel_id;
  updateRobotStatus(robot.id, robot.status);
};

const getLiveRobots = async () => {
  wss = require("../services/wss");
  let checkRobots = [];
  await wss.clients.forEach(async ws => {
    if (ws.robot) {
      checkRobots.push(ws.robot);
    }
  });
  return checkRobots;
};

const checkInterval = async () => {
  const { createSimpleTimer } = require("../modules/utilities");
  const { liveStatusInterval } = require("../config/server");
  await createSimpleTimer(liveStatusInterval, this.robotStatus);
  return;
};

const updateRobotStatus = async robotsToUpdate => {
  const { createTimeStamp } = require("../modules/utilities");
  const { updateRobotStatus } = require("../models/robot");
  await robotsToUpdate.forEach(async robot => {
    log(`Robot, ${robot}, Status: ${robot.status}`);
    robot.status.heartBeat = createTimeStamp();

    await updateRobotStatus(robot.id, robot.status);
    // console.log("ROBOT CHECK: //////////////////", robot);
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};

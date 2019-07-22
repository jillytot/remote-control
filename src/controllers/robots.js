let robots = [];
let prevBots = [];

module.exports.robotStatus = async () => {
  const { updateRobotServer } = require("../models/robotServer");
  const { isEqual } = require("../modules/utilities");
  const { checkForLiveRobots } = require("../controllers/robotServer");
  prevBots = robots;
  robots = await getLiveRobots();
  console.log("Checking Live Robots");
  await updateRobotStatus(robots);
  await checkForLiveRobots();
  //if (!isEqual(prevBots, robots))
  updateRobotServer(); //only send update event on changes
  checkInterval();
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
  const { liveStatusInterval } = require("../config/serverSettings");
  await createSimpleTimer(liveStatusInterval, this.robotStatus);
  return;
};

const updateRobotStatus = async robotsToUpdate => {
  const { createTimeStamp } = require("../modules/utilities");
  const { updateRobotStatus } = require("../models/robot");
  await robotsToUpdate.forEach(async robot => {
    robot.status.heartBeat = createTimeStamp();
    await updateRobotStatus(robot.id, robot.status);
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};

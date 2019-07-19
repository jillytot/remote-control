let robots = [];

module.exports.robotStatus = async () => {
  const checkRobots = await getLiveRobots();
  robots = checkRobots;
  console.log("ROBOTS STATUS: ", robots);
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
  robots = checkRobots;
  return robots;
};

const checkInterval = async () => {
  const { createSimpleTimer } = require("../modules/utilities");
  const { liveStatusInterval } = require("../config/serverSettings");
  await createSimpleTimer(liveStatusInterval, this.robotStatus);
  return;
};

module.exports.getLiveRobots = () => {
  return robots;
};

let robots = [];
let prevRobots = [];

module.exports.robotStatus = async () => {
  const { isEqual } = require("../modules/utilities");
  const checkRobots = await getLiveRobots();
  if (!isEqual(robots, checkRobots)) {
    console.log("////////////////////////////////////////////////////////");
    prevRobots = robots;
    robots = checkRobots;
    updateRobotStatus();
  }
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

updateRobotStatus = async () => {
  const robotsToUpdate = getLiveRobotList();
  if (robotsToUpdate !== []) {
    const getUpdates = await setLiveRobots(robotsToUpdate);
    if (!getUpdates) return;
    const keys = Object.keys(getUpdates);
    keys.forEach(key => {
      updateLiveRobotStatus(key, getUpdates[key]);
    });
  }
  return;
};

const getLiveRobotList = () => {
  return robots;
};

//Figures out which servers to update with live robots
const setLiveRobots = liveRobots => {
  //   console.log("*** ROBOT STATUS CHECK 3", liveRobots);
  let robotsToUpdate = {};
  liveRobots.forEach(robot => {
    if (!(robot.host_id in robotsToUpdate)) robotsToUpdate[robot.host_id] = [];
    robotsToUpdate[robot.host_id].push(robot.id);
  });
  console.log("*** ROBOT STATUS CHECK 4", robotsToUpdate);
  return robotsToUpdate;
};

const setOfflineRobots = () => {};

/*
 Determines if live devices needs to be updated per server
 updates the DB as needed, 
 sends WS event when server has updated status
*/
const updateLiveRobotStatus = async (server_id, liveRobots) => {
  const { isEqual } = require("../modules/utilities");
  let listRobots = [];
  liveRobots.forEach(robot => {
    listRobots.push(robot);
  });
  const {
    updateRobotServer,
    getRobotServer,
    updateRobotServerStatus
  } = require("../models/robotServer");
  const server = await getRobotServer(server_id);
  let status = server.status;
  if (server.status) {
    console.log("ROBOT STATUS CHECK: ", listRobots, status.liveDevices);
    if (!("liveDevices" in status)) {
      console.log(
        "Cant find liveDevices in server status, inserting default value"
      );
      status.liveDevices = [];
    }
    if (!isEqual(listRobots, status.liveDevices)) {
      status.liveDevices = listRobots;
      const save = await updateRobotServerStatus(server.server_id, status);
      console.log("UPDATING ROBOT STATUS: ", save);
      updateRobotServer();
    }
  }
  return;
};

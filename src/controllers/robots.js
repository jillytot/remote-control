let robots = [];
let prevRobots = [];

module.exports.robotStatus = async () => {
  const { isEqual } = require("../modules/utilities");
  const checkRobots = await getLiveRobots();
  if (!isEqual(robots, checkRobots)) {
    console.log("////////////////////////////////////////////////////////");
    prevRobots = robots;
    robots = checkRobots;
    sortRobotUpdates(getLiveRobotList(), true);
  }

  if (!isEqual(prevRobots, robots)) {
    console.log("Checking for offline robots");
    const deadRobots = getDeadRobots(prevRobots, robots);
    prevRobots = robots;
    if (deadRobots) {
      sortRobotUpdates(getLiveRobotList(), false);
    }
  }
  checkInterval();
};

const getDeadRobots = (prevRobots, robots) => {
  const { getArrayDifference } = require("../modules/utilities");
  const deadBots = getArrayDifference(prevRobots, robots);
  console.log("ROBOTS UPDATE TO OFFLINE: ", deadBots);
  return deadBots;
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

sortRobotUpdates = async (robotsToUpdate, online) => {
  const getUpdates = await getSortedRobots(robotsToUpdate);
  if (!getUpdates) return;
  const keys = Object.keys(getUpdates);
  keys.forEach(key => {
    if (online === true) {
      updateRobotStatus(key, { liveRobots: getUpdates[key] });
    }
    if (online === false) {
      updateRobotStatus(key, { deadRobots: getUpdates[key] });
    }
  });
  return;
};

const getLiveRobotList = () => {
  return robots;
};

//Figures out which servers to update with live robots
const getSortedRobots = liveRobots => {
  //   console.log("*** ROBOT STATUS CHECK 3", liveRobots);
  let robotsToUpdate = {};
  liveRobots.forEach(robot => {
    if (!(robot.host_id in robotsToUpdate)) robotsToUpdate[robot.host_id] = [];
    robotsToUpdate[robot.host_id].push(robot.id);
  });
  console.log("*** ROBOT STATUS CHECK 4", robotsToUpdate);
  return robotsToUpdate;
};

/*
 Determines if live devices needs to be updated per server
 updates the DB as needed, 
 sends WS event when server has updated status
*/
const updateRobotStatus = async (server_id, updateRobots) => {
  const {
    updateRobotServer,
    getRobotServer,
    updateRobotServerStatus
  } = require("../models/robotServer");
  const { isEqual } = require("../modules/utilities");

  const { liveRobots, deadRobots } = updateRobots;

  let listRobots = [];
  if (liveRobots) {
    liveRobots.forEach(robot => {
      listRobots.push(robot);
    });
  }

  if (deadRobots) {
    deadRobots.forEach(robot => {
      listRobots.push(robot);
    });
  }

  const server = await getRobotServer(server_id);
  let status = server.status;
  if (server.status) {
    console.log("ROBOT STATUS CHECK: ", listRobots, status.liveDevices);

    //THIS CONDITIONAL CAN BE REMOVED ONCE THIS VALUE IS ADDED TO ALL SERVERS
    if (!("liveDevices" in status)) {
      console.log(
        "Cant find liveDevices in server status, inserting default value"
      );
      status.liveDevices = [];
    }
    //******************************************************************* */

    if (liveRobots && !isEqual(listRobots, status.liveDevices)) {
      status.liveDevices = listRobots;
      const save = await updateRobotServerStatus(server.server_id, status);
      console.log("UPDATING ROBOT STATUS: ", save);
      updateRobotServer();
      return;
    }

    if (deadRobots && !isEqual(listRobots, status.liveDevices)) {
      let updateList = [];
      status.liveDevices.forEach(robot => {
        if (!deadRobots.includes(robot)) {
          updateList.push(robot);
        }
      });
      status.liveDevices = updateList;
      const save = await updateRobotServerStatus(server.server_id, status);
      console.log("UPDATING OFFLINE ROBOTS: ", save);
      updateRobotServer();
      return;
    }
    console.log("No Robots Are Updated: ", server_id, updateRobots);
  }
  return;
};

module.exports.checkForLiveRobots = async () => {
  const { getRobotServers } = require("../models/robotServer");
  const servers = await getRobotServers();
  const updatedServers = await servers.forEach(async server => {
    await this.getActiveRobotsOnServer(server);
  });
  //return updatedServers;
};

module.exports.getActiveRobotsOnServer = async server => {
  const { getRobotsFromServerId } = require("../models/robot");
  const { createTimeStamp } = require("../modules/utilities");
  const { liveStatusInterval } = require("../config/serverSettings");
  const { updateRobotServerStatus } = require("../models/robotServer");
  const robots = await getRobotsFromServerId(server.server_id);
  let liveDevices = [];
  //console.log("///////////CHECK ROBOT DATA///////////", robots);
  if (robots.error) return;
  robots.map(robot => {
    if (
      robot.status.heartBeat &&
      robot.status.heartBeat >= createTimeStamp() - liveStatusInterval * 1.25
    ) {
      liveDevices.push(robot.id);
      console.log("updatingLiveRobot", robot);
    }
  });
  server.status.liveDevices = liveDevices;
  const updateStatus = await updateRobotServerStatus(
    server.server_id,
    server.status
  );
  //return updateStatus;
};

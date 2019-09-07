const { err } = require("../modules/utilities");

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

module.exports.deleteRobotServer = async (server_id, user_id) => {
  const {
    deleteRobotServer,
    getRobotServer,
    updateRobotServer
  } = require("../models/robotServer");
  // const getServer = await getRobotServer(server_id); //validate server:
  // if (user_id === getServer.owner_id) {
  //   //delete!
  // }

  const remove = await deleteRobotServer(server_id);
  console.log("DELTING SERVER: ", remove);
};

module.exports.updateListing = async (server, user_id) => {
  // console.log("////CHANGE LISTING CHECK 2 //////", server, user_id);
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../models/robotServer");
  let getServer = await getRobotServer(server.server_id);
  if (getServer.owner_id === user_id) {
    getServer.settings.unlist = JSON.parse(server.settings.unlist);
    const updateSettings = await updateRobotServerSettings(
      getServer.server_id,
      getServer.settings
    );
    if (updateSettings) return updateSettings.settings;
  }
  return null;
};

module.exports.setPrivate = async (server, user_id) => {
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../models/robotServer");
  let getServer = await getRobotServer(server.server_id);
  if (getServer.owner_id === user_id) {
    getServer.settings.private = JSON.parse(server.settings.private);
    const updateSettings = await updateRobotServerSettings(
      getServer.server_id,
      getServer.settings
    );
    if (updateSettings) return updateSettings.settings;
  }
  return null;
};

module.exports.getPublicServers = async () => {
  const { getRobotServers } = require("../models/robotServer");
  let getServers = await getRobotServers();
  let list = [];
  getServers.forEach(server => {
    if (server.settings.unlist === true || server.settings.private === true) {
      console.log(
        "THIS SERVER IS UNLISTED AND OR PRIVATE! ",
        server.server_name,
        server.settings
      );
      //do nothing
    } else {
      list.push(server);
    }
  });
  return list;
};

module.exports.getServerByName = async (name, user) => {
  const { getRobotServerFromName } = require("../models/robotServer");
  const getServer = await getRobotServerFromName(name);
  if (getServer.settings.private === true)
    return checkMembership(getServer, user);
  if (getServer) return getServer;
  return err("This server doesn't exist");
};

const checkMembership = async (server, user) => {
  console.log("CHECKING MEMBERSHIP FOR PRIVATE SERVER!!! ");
  const { getMember } = require("../models/serverMembers");
  console.log(user);
  const check = await getMember({
    user_id: user.id,
    server_id: server.server_id
  });
  console.log(check);
  if (check.status.member === true) return server;
  return err("You are not a member of this server.");
};

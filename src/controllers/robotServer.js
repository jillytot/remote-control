const { err } = require("../modules/utilities");
const { jsonError } = require("../modules/logging");

//Triggers API call from client to update the currently selected robot server
module.exports.updateSelectedServer = server_id => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.server_id === server_id) {
      ws.emitEvent("SELECTED_SERVER_UPDATED");
    }
  });
};

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
  const { liveStatusInterval } = require("../config/server");
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
      liveDevices.push(robot);
      console.log("updatingLiveRobot", robot.name);
    }
  });
  server.status.liveDevices = liveDevices;
  await updateRobotServerStatus(server.server_id, server.status);
  return;
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

module.exports.updateSettings = async (server, user_id) => {
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../models/robotServer");
  const { authLocal } = require("./roles");

  let getServer = await getRobotServer(server.server_id);
  const authUpdate = await authLocal(getServer, { id: user_id });

  if (authUpdate.authorized) {
    if (server.settings.hasOwnProperty("private"))
      getServer.settings.private = server.settings.private;
    if (server.settings.hasOwnProperty("unlist"))
      getServer.settings.unlist = server.settings.unlist;
    if (server.settings.hasOwnProperty("phonetic_filter"))
      getServer.settings.phonetic_filter = server.settings.phonetic_filter;
    if (server.settings.hasOwnProperty("announce_followers_in_chat"))
      getServer.settings.announce_followers_in_chat =
        server.settings.announce_followers_in_chat;
    const updateSettings = await updateRobotServerSettings(
      getServer.server_id,
      getServer.settings
    );
    if (updateSettings) return updateSettings.settings;
  }

  this.updateSelectedServer(getServer.server_id);
  return null;
};

module.exports.getPublicServers = async () => {
  const { getRobotServers } = require("../models/robotServer");
  let getServers = await getRobotServers();
  let list = [];
  getServers.forEach(server => {
    if (server.settings.unlist === true || server.settings.private === true) {
      // console.log(
      //   "THIS SERVER IS UNLISTED AND OR PRIVATE! ",
      //   server.server_name,
      //   server.settings
      // );
      //do nothing
    } else {
      list.push(server);
    }
  });
  return list;
};

//user membership status is appended to the server object
module.exports.getServerByName = async (name, user) => {
  const { getRobotServerFromName } = require("../models/robotServer");
  const { getMember } = require("../models/serverMembers");
  let getServer = await getRobotServerFromName(name);

  if (!getServer) return err("This server doesn't exist");
  const membership = await getMember({
    user_id: user.id,
    server_id: getServer.server_id
  });
  getServer.membership = membership || null;
  // console.log("GET SERVER CHECK: ", getServer);
  if (getServer.settings.private === true) return checkMembership(getServer);
  return getServer;
};

const checkMembership = async server => {
  const { status } = server.membership;
  // console.log(check);
  if (status.member === true) {
    return server;
  }
  return err("You are not a member of this server.");
};

//For displaying public server information relating to a server.
module.exports.getPublicServerInfo = async server => {
  const { getPublicUserFromId } = require("../controllers/user");
  const user = await getPublicUserFromId(server.owner_id);
  const publicInfo = {
    server_name: server.server_name,
    server_id: server.server_id,
    created: server.created,
    owner_id: server.owner_id,
    owner_name: user.username,
    default_channel: server.default_channel,
    members: server.status.count,
    public: server.status.public,
    live_devices: server.status.liveDevices,
    default_channel: server.settings.default_channel
  };
  return publicInfo;
};

module.exports.getServerById = async server_id => {
  const { getRobotServer } = require("../models/robotServer");
  const server = await getRobotServer(server_id);
  if (server) {
    return server;
  }
  return jsonError("Unable to get requested server information");
};

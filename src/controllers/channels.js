//This is just a temporary stopgap until more robust logic can replace it
const { jsonError } = require("../modules/logging");

module.exports.tempEnsureDefaultChannel = async (server_id, channel_id) => {
  const { getChannels } = require("../models/channel");
  const {
    getRobotServer,
    updateRobotServerSettings,
    updateRobotServer
  } = require("../models/robotServer");
  const getServer = await getRobotServer(server_id);
  if (getServer.settings.default_channel === channel_id) {
    let { settings } = getServer;
    newDefault = await getChannels(server_id);
    settings.default_channel = newDefault[0].id;
    console.log("SETTING NEW DEFAULT CHANNEL: ", settings);
    await updateRobotServerSettings(server_id, settings);
    updateRobotServer();
  }
  return true;
};

module.exports.setDefaultChannel = async (user, channel_id, server_id) => {
  const { authLocal } = require("./roles");
  const { getChannel } = require("../models/channel");
  const {
    getRobotServer,
    updateRobotServerSettings
  } = require("../models/robotServer");

  //get server information:
  const server = await getRobotServer(server_id);
  if (!server) return jsonError(`Unable to find server with id: ${server_id}`);
  let { settings } = server;

  //Auth User
  const auth = await authLocal(user, server);
  if (auth.error) return auth;

  //verify channel exists:
  const checkChannel = await getChannel(channel_id);
  if (checkChannel.error) return checkChannel;

  //Update Settings:
  settings.default_channel = checkChannel.id;
  const updateSettings = await updateRobotServerSettings(server.server_id);
  if (!updateSettings) return jsonError("Could not update settings for server");
  return updateSettings;
};

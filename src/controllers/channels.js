//This is just a temporary stopgap until more robust logic can replace it
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
    await updateRobotServerSettings(server_id, settings);
    updateRobotServer();
  }
  return true;
};

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
    // console.log("SETTING NEW DEFAULT CHANNEL: ", settings);
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
  const { updateSelectedServer } = require("./robotServer");

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
  const updateSettings = await updateRobotServerSettings(
    server.server_id,
    settings
  );
  if (!updateSettings) return jsonError("Could not update settings for server");
  updateSelectedServer(server.server_id);
  // console.log("Update Settings Result: ", updateSettings);
  return updateSettings;
};

/**
 * Input From: /src/routes/api/channels/rename
 */
module.exports.renameChannel = async (user, channel_id, channel_name) => {
  const { updateChannelName, getChannel } = require("../models/channel");
  const { getRobotServer } = require("../models/robotServer");
  const { authLocal } = require("./roles");
  const { validateChannelName } = require("./validate");

  const genericError =
    "There was a problem with update channel name request, please try again later";

  //Ensure channel name is formatted correctly, and isn't a duplicate name.
  const validateName = validateChannelName(channel_name);
  if (validateName.error) return validateName;
  const checkForDupes = this.checkChannelName(channel_name);
  if (checkForDupes.error) return checkForDupes;

  //Check and see if this user is allowed to update the channel name.
  let server = null;
  let channel = await getChannel(channel_id);
  if (channel) server = await getRobotServer(channel.host_id);
  else return jsonError(genericError);
  if (!server) return jsonError(genericError);
  const validate = await authLocal(user, server, null);
  if (validate.error) return validate;

  //rename the channel:
  const update = await updateChannelName({
    name: channel_name,
    id: channel.id
  });
  // console.log("Update Selected Server: ", server.server_id);
  this.updateChannelsOnServer(server.server_id);
  return update;
};

module.exports.checkChannelName = async (channel_name, server_id) => {
  const { getChannels } = require("../models/channel");
  const check = await getChannels(server_id);
  let dupe = null;
  check.forEach(channel => {
    if (channel.name === channel_name) dupe = true;
  });
  if (dupe === true)
    return jsonError("You cannot have duplicate channel names");
  return null;
};

module.exports.updateChannelsOnServer = async server_id => {
  const { CHANNELS_UPDATED } = require("../events/definitions");
  const { emitEvent } = require("../models/robotServer");
  const { getChannels } = require("../models/channel");
  const channels = await getChannels(server_id);
  emitEvent(server_id, CHANNELS_UPDATED, channels);
};

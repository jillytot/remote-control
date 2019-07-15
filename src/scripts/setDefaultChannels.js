const updateDefault = async () => {
  const {
    getRobotServers,
    updateRobotServerSettings
  } = require("../models/robotServer");
  const servers = await getRobotServers();
  await servers.map(server => {
    let settings = server.settings;
    settings.default_channel = server.channels[0].id;
    updateRobotServerSettings(server.server_id, settings);
  });
};

updateDefault();

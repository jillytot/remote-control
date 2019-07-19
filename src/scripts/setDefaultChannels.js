const updateDefault = async () => {
  const {
    getRobotServers,
    updateRobotServerSettings
  } = require("../models/robotServer");
  const servers = await getRobotServers();
  await servers.map(async server => {
    let settings = server.settings;
    settings.default_channel = server.channels[0].id;
    console.log("CHECK DEFAULT VALUE: ", server.channels[0]);
    await updateRobotServerSettings(server.server_id, settings);
  });
};

updateDefault();

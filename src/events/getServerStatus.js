module.exports = async (ws, data) => {
  console.log("GET LOCAL STATUS ", data, ws.user);

  const {
    sendRobotStatus,
    getRobotServer
  } = require("../models/serverMembers");
  const { server_id } = data;

  const getServer = await getRobotServer(server_id);
  sendRobotStatus(server_id, getServer.status);
};

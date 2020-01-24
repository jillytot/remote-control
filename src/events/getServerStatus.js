module.exports = async (ws, data) => {
  const { logLevel } = require("../config/server/index");
  if (logLevel === "debug") console.log("GET LOCAL STATUS ", data, ws.user);

  const {
    sendRobotServerStatus,
    getRobotServer
  } = require("../models/robotServer");
  const { server_id } = data;

  const getServer = await getRobotServer(server_id);
  sendRobotServerStatus(server_id, getServer.status);
};

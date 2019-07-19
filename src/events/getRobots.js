module.exports = async (ws, data) => {
  const { GET_ROBOTS } = require("./definitions");
  const { getRobotsFromServerId } = require("../models/robot");
  const { getRobotServer } = require("../models/robotServer");
  console.log("GET ROBOTS CHECK: ", data.server_id);
  const requestedRobotServer = await getRobotServer(data.server_id);

  if (ws.user && requestedRobotServer.owner_id !== ws.user.id) {
    return;
  }

  ws.emitEvent(GET_ROBOTS, await getRobotsFromServerId(data.server_id));
};

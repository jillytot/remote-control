module.exports = async (ws, server_id) => {
  const { GET_ROBOTS } = require("./definitions");
  console.log("GET ROBOTS CHECK: ", server_id);
  const requestedRobotServer = await getRobotServer(server_id);

  if (requestedRobotServer.owner_id !== ws.user.id) {
    return;
  }

  const { getRobotsFromServerId } = require("../models/robot");

  ws.emitEvent(GET_ROBOTS, await getRobotsFromServerId(server_id));
};

const {
  deleteRobotServer,
  updateRobotServer
} = require("../models/robotServer");

const deleteServer = async () => {
  let server = process.argv[2];
  console.log("DELETING SERVER: ", server);
  const kill = await deleteRobotServer(server);
  updateRobotServer();
  console.log("DELETION RESULT: ", kill);
  process.exit();
};

deleteServer();

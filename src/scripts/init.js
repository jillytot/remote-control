module.exports = () => {
  const { robotStatus } = require("../controllers/robots");
  const { initActiveServers } = require("../models/robotServer");
  const { initActiveChats } = require("../models/chatRoom");

  robotStatus();

  //Initalize Active Servers:
  //This is used for storing active users on a server
  initActiveServers();
  initActiveChats();
};

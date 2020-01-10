module.exports = () => {
  const { robotStatus } = require("../controllers/robots");
  const { syncPatreonData } = require("../controllers/patreon");
  const { initActiveServers } = require("../models/robotServer");
  const { initActiveChats } = require("../models/chatRoom");

  robotStatus();
  syncPatreonData();

  //Initalize Active Servers:
  //This is used for storing active users on a server
  initActiveServers();
  initActiveChats();
};

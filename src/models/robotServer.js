const { makeId, createTimeStamp } = require("../modules/utilities");

/* 
Robot server is owned by a user
Robot server starts with a default chatroom
multiple rooms can be added
Robot server should be able to operate independently on its on physical machine

List of Members / Subscribers
List of online / Active Members
*/

module.exports.createRobotServer = async server => {
  console.log("About to build server: ", server);
  const { id, serverName } = server;
  console.log(id);
  let buildServer = {};
  buildServer.OwnerId = id;
  buildServer.serverName = serverName;
  buildServer.id = makeId();
  buildServer.created = createTimeStamp();
  buildServer.channels = robotServer.channels;

  console.log("Server Generated: ", buildServer);
  return buildServer;
};

const robotServer = {
  serverName: "",
  serverId: "",
  ownerId: "",
  channels: ["Welcome", "General"],
  users: [],
  created: ""
};

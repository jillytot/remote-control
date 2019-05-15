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
  buildServer.owner_id = id;
  buildServer.server_name = serverName;
  buildServer.server_id = makeId();
  buildServer.created = createTimeStamp();
  buildServer.channels = robotServer.channels;
  buildServer.users = [];

  await this.createChatRooms(buildServer);
  await this.saveServer(buildServer);
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

module.exports.saveServer = async server => {
  const db = require("../services/db");
  console.log("Saving Server: ", server);
  const { server_id, server_name, owner_id, channels, users, created } = server;

  const dbPut = `INSERT INTO robot_servers (server_id, server_name, owner_id, channels, users, created ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
  try {
    await db.query(dbPut, [
      server_id,
      server_name,
      owner_id,
      channels,
      users,
      created
    ]);
  } catch (err) {
    console.log(err.stack);
  }
  //Save to DB
  this.updateRobotServer();
};

module.exports.getRobotServers = async () => {
  //TODO: Some kind of sorting / capping list #
  const db = require("../services/db");
  const query = `SELECT * FROM robot_servers`;
  result = await db.query(query);
  console.log(result.rows);
  return result.rows;
};

module.exports.updateRobotServer = () => {
  const { io } = require("../services/server/server");
  io.emit("ROBOT_SERVER_UPDATED");
};

//Automatically generate the intial chat rooms for each server
//save them to the DB with a reference to the parent server
//client can request channels / chatrooms from the API to join
//subscribing and events are done through socket.io
//Chat messages are also saved into the DB ... maybe
module.exports.createChatRooms = robotServer => {
  //Will make a more proper method for adding custom chatrooms later
  const { createChatRoom } = require("./chatRoom");

  robotServer.channels.forEach(channel => {
    createChatRoom({
      name: channel,
      host_id: robotServer.server_id
    });
  });
};

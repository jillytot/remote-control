/* 
Robot server is owned by a user
Robot server starts with a default channel assigned a chatroom
multiple channels can be added
Robot server should be able to operate independently on its on physical machine

Global: User: Robot Server

List of Members / Subscribers
List of online / Active Members
*/

const { makeId, createTimeStamp } = require("../modules/utilities");
const {
  ACTIVE_USERS_UPDATED
} = require("../services/sockets/events").socketEvents;

//Used to generate / create a new robot server
module.exports.createRobotServer = server => {
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

  this.createChannels(buildServer);
  this.saveServer(buildServer);
  console.log("Server Generated: ", buildServer);
  this.pushToActiveServers(buildServer);
  return buildServer;
};

//Template for robot server object
const robotServer = {
  serverName: "",
  serverId: "",
  ownerId: "",
  channels: ["Welcome", "General"],
  users: [],
  created: ""
};

//Saves robot server to the Database
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

//Keep list of active users in memmory for now
let activeServers = []; //Make this a global
//This function is called once in 'src/services/server/server.js'
//It initializes the active server sessions in memmory for all the servers currently stored in the database
module.exports.initActiveServers = async () => {
  const db = require("../services/db");
  const query = `SELECT * FROM robot_servers`;
  try {
    result = await db.query(query);
    console.log("Active Servers Initailized", result.rows);
    activeServers = result.rows;
  } catch (err) {
    console.log(err);
  }
};

//add a new active server to the active servers list
module.exports.pushToActiveServers = robotServer => {
  activeServers.push(robotServer);
  console.log("Active Servers Updated: ", activeServers);
};

//return specified server from the list of active servers
module.exports.getActiveServer = server_id => {
  let pickServer = activeServers.filter(
    server => server.server_id === server_id
  );
  console.log("Pick Active Robot Server: ", pickServer);
  return pickServer[0];
};

//Add an active user to a live robot server
module.exports.addActiveUser = async (userId, server_id) => {
  const { getPublicUserInfo } = require("./user");
  let dontUpdate = false;
  console.log("Add User to Robot Server: ", userId, server_id);
  try {
    let getRobotServer = await this.getActiveServer(server_id);
    let activeUsers = getRobotServer.users;

    activeUsers.forEach(activeUser => {
      console.log("Check Active User: ", activeUsers);
      if (activeUser.id === userId) {
        dontUpdate = true;
        console.log("DONT UPDATE ACTIVE USERS!");
        // break addActiveUser;
      }
    });
    if (!dontUpdate) {
      //Get the rest of the user info from the DB
      activeUsers.push(await getPublicUserInfo(userId));
      activeServers.filter(server => {
        if (server_id === server.server_id) {
          server.users = activeUsers;
          console.log("Updated Active Users: ", server);
          this.activeUsersUpdated(server_id);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//Get all the robot servers currently saved in the database
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

//Sends updated active user list to all users on a robot server
module.exports.activeUsersUpdated = async server_id => {
  let pickServer = await this.getActiveServer(server_id);
  const { io } = require("../services/server/server");
  console.log("Send Active Users: ", server_id);
  io.to(server_id).emit(ACTIVE_USERS_UPDATED, pickServer.users);
};

//This is going to need some serious cleanup
//Used to add the default chatrooms to a robot server when it's created
module.exports.createChatRooms = async robotServer => {
  //Will make a more proper method for adding custom chatrooms later
  const { createChatRoom } = require("./chatRoom");
  try {
    return await robotServer.channels.forEach(channel => {
      return createChatRoom({
        name: channel,
        host_id: robotServer.server_id
      });
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.createChannels = async robotServer => {
  const { createChannel } = require("./channel");
  const { createChatRoom } = require("./chatRoom");
  try {
    return await robotServer.channels.forEach(channel => {
      const makeChat = createChatRoom(robotServer);
      const { id } = makeChat;
      console.log("make chat from create channels", makeChat, channel);
      return createChannel({
        name: channel,
        host_id: robotServer.server_id,
        chat: id //get chat reference ID, or if none exists, create one?
      });
    });
  } catch (err) {
    console.log(err);
  }
};

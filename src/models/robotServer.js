/* 
Robot server is owned by a user
Robot server starts with a default channel assigned a chatroom
multiple channels can be added
Robot server should be able to operate independently on its on physical machine

Global: User: Robot Server

On Boot: 
Get Servers From DB
Build active Servers from DB
Build Channels within each server, 
Build chatrooms within each channel
Load recent chats for each chat room
Set built server to active server. 

Operate from active server, limit the active server memmory and set rules

Adding a new server: 
Build the server out
Build out it's default channels
Build out it's default chat
Save it to DB
Push Server to Active Servers

*/

const { makeId, createTimeStamp } = require("../modules/utilities");
const {
  ACTIVE_USERS_UPDATED
} = require("../services/sockets/events").socketEvents;

const { extractToken } = require("./user");

//Used to generate / create a new robot server
module.exports.createRobotServer = async (server, token) => {
  console.log("About to build server: ", server, token);
  const { id, server_name } = server;
  console.log(id);
  let buildServer = {};
  buildServer.owner_id = await extractToken(token);
  buildServer.server_name = server_name;
  buildServer.server_id = `serv-${makeId()}`; //Note: if server_id === 'remo', then it is refering to the global server
  buildServer.created = createTimeStamp();
  buildServer.channels = robotServer.channels;
  buildServer.users = [];

  await this.createChannels(buildServer);
  await this.saveServer(buildServer);
  console.log("Generating Server: ", buildServer);
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
        return;
      }
    });
    if (!dontUpdate) {
      //Get the rest of the user info from the DB
      activeUsers.push(await getPublicUserInfo(userId));
      return activeServers.filter(server => {
        if (server_id === server.server_id) {
          console.log("Updated Active Users: ", server);
          this.activeUsersUpdated(server_id);
          return (server.users = activeUsers);
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

module.exports.createChannels = async robotServer => {
  const { createChannel } = require("./channel");
  const { createChatRoom } = require("./chatRoom");
  try {
    return await robotServer.channels.forEach(channel => {
      const makeChat = createChatRoom(robotServer, channel);
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

//MODERATION
module.exports.sendGlobalTimeout = (server_id, badUser) => {
  const { io } = require("../services/server/server");
  const { GLOBAL_TIMEOUT } = require("../services/sockets/events").socketEvents;
  const { publicUser } = require("./user");
  io.to(server_id).emit(GLOBAL_TIMEOUT, publicUser(badUser));
};

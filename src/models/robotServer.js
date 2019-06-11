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
  const { server_name } = server;
  const getUserId = await extractToken(token);
  console.log("GET USER ID FROM TOKEN: ", getUserId, getUserId.id);

  let buildServer = {};
  buildServer.owner_id = getUserId.id;
  buildServer.server_name = server_name;
  buildServer.server_id = `serv-${makeId()}`; //Note: if server_id === 'remo', then it is refering to the global server
  buildServer.created = createTimeStamp();
  buildServer.channels = [];
  buildServer.settings = {
    default_channel: "General",
    roles: [
      {
        role: "default",
        members: ["@everyone"]
      },
      { role: "owner", members: [getUserId.id] }
    ]
  };
  buildServer.status = {
    public: true
  };
  buildServer.users = [];

  buildServer.channels.push(await this.initChannels(buildServer));
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
  created: "",
  settings: {},
  status: {}
};

//Saves robot server to the Database
module.exports.saveServer = async server => {
  const db = require("../services/db");
  console.log("Saving Server: ", server);
  const {
    server_id,
    server_name,
    owner_id,
    channels,
    users,
    created,
    settings,
    status
  } = server;

  const dbPut = `INSERT INTO robot_servers (server_id, server_name, owner_id, channels, users, created, settings, status ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
  try {
    await db.query(dbPut, [
      server_id,
      server_name,
      owner_id,
      channels,
      users,
      created,
      settings,
      status
    ]);
  } catch (err) {
    console.log(err.stack);
  }
  //Save to DB
  this.updateRobotServer();
};

//Keep list of active users in memmory for now
let activeServers = []; //I NEED TO RETHINK THIS SYSTEM (like how socket event / rooms are working)
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

const defaultChannel = "General";
module.exports.initChannels = async server => {
  const { createChannel } = require("./channel");
  const { createChatRoom } = require("./chatRoom");
  const makeChat = await createChatRoom(server, defaultChannel);
  const { id } = makeChat;
  const makeChannel = await createChannel({
    name: defaultChannel,
    host_id: server.server_id,
    chat: id
  });
  return { id: makeChannel.id, name: makeChannel.name };
};

//MODERATION
module.exports.sendGlobalTimeout = (server_id, badUser) => {
  const { io } = require("../services/server/server");
  const { GLOBAL_TIMEOUT } = require("../services/sockets/events").socketEvents;
  const { publicUser } = require("./user");
  io.to(server_id).emit(GLOBAL_TIMEOUT, publicUser(badUser));
};

module.exports.getLocalTypes = async (server_id, user_id) => {
  let localTypes = [];
  const getServer = await this.getRobotServer(server_id);
  const { settings } = getServer;
  settings.roles.forEach(role => {
    role.members.forEach(member => {
      if (user_id === member) {
        localTypes.push(role.role);
        console.log(`Pushing ${role.role} to ${localTypes}`);
      }
    });
  });

  console.log("SENDING LOCAL TYPES: ", localTypes);
  return localTypes;
};

module.exports.getRobotServer = async server_id => {
  const db = require("../services/db");
  try {
    const query = "SELECT * FROM robot_servers WHERE server_id = $1 LIMIT 1";
    const result = await db.query(query, [server_id]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

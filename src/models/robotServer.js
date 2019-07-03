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
const { ACTIVE_USERS_UPDATED } = require("../events/definitions");

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
      //TODO: Deprecate this structure after finishing up server members / roles / invites structure
      {
        role: "default",
        members: ["@everyone"]
      },
      { role: "owner", members: [getUserId.id] }
    ]
  };

  buildServer.roles = [
    /* generate default roles */
  ];

  buildServer.status = {
    public: true
  };

  buildServer.users = [];
  buildServer.invites = [
    /* create default invite */
  ];

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
  status: {},
  invites: [],
  roles: []
};

module.exports.emitEvent = (server_id, event, data) => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.server_id === server_id) {
      ws.emitEvent(event, data);
    }
  });
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
    status,
    invites,
    roles
  } = server;

  const dbPut = `INSERT INTO robot_servers (server_id, server_name, owner_id, channels, users, created, settings, status, invites, roles ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
  try {
    await db.query(dbPut, [
      server_id,
      server_name,
      owner_id,
      channels,
      users,
      created,
      settings,
      status,
      invites,
      roles
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
  const wss = require("../services/wss");
  wss.emitEvent("ROBOT_SERVER_UPDATED");
};

//Sends updated active user list to all users on a robot server
module.exports.activeUsersUpdated = async server_id => {
  let pickServer = await this.getActiveServer(server_id);
  console.log("Send Active Users: ", server_id);
  this.emitEvent(server_id, ACTIVE_USERS_UPDATED, pickServer.users);
};

//Create a default chat when a server is first generated
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

//sends globaltimeout message ot user on chatroom in which the ban was initiated
//This could probably be better
module.exports.sendGlobalTimeout = (server_id, badUser) => {
  const { GLOBAL_TIMEOUT } = require("../events/definitions");
  const { publicUser } = require("./user");
  this.emitEvent(server_id, GLOBAL_TIMEOUT, publicUser(badUser));
};

//Get user roles / types for a specific server
module.exports.getLocalTypes = async (server_id, user_id) => {
  let localTypes = [];
  const getServer = await this.getRobotServer(server_id);
  if (!getServer) {
    return localTypes;
  }
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

//Get all server information from server_id
module.exports.getRobotServer = async server_id => {
  const db = require("../services/db");
  try {
    const query = "SELECT * FROM robot_servers WHERE server_id = $1 LIMIT 1";
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) {
      const showResult = result.rows[0];
      console.log(showResult);
      return showResult;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

//This will permanently remove a robot server from the DB
module.exports.deleteRobotServer = async server_id => {
  console.log(server_id);
  const db = require("../services/db");
  try {
    const query = "DELETE FROM robot_servers WHERE server_id =$1";
    const result = await db.query(query, [server_id]);
    console.log("Deleted row count: ", result.rowCount);
    //await this.removeActiveServer(server_id);
    await this.updateRobotServer();
    if (result.rowCount > 0) {
      console.log("SUCCESSFULLY DELETED SERVER");
    } else {
      console.log("Error Deleting Server");
    }
    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/* 
Moderation Feature
Now:
Perminately de-lists a server from being displayed publicly
Cannot be over ridden by owner

Future: 
Suspends all internal server activity
Server can only be accessed by owner, or mods at global level
*/
module.exports.disableRobotServer = async server_id => {
  console.log("Kill Server: ", server_id);
  //get server info
  let updateServer = await this.getRobotServer(server_id);
  console.log("GET SERVER TO UPDATE: ", updateServer);
  updateServer.status.disabled = true;
  const disableServer = await this.updateRobotServerStatus(
    server_id,
    updateServer.status
  );
  console.log("DISABLE SERVER RESULT: ", disableServer);
  //emit event
};

module.exports.updateRobotServerStatus = async (server_id, status) => {
  const db = require("../services/db");
  console.log("Updating Robot Server Status: ", server_id);
  try {
    const update = `UPDATE robot_servers SET status = $1 WHERE server_id = $2 RETURNING *`;
    const result = await db.query(update, [status, server_id]);
    if (result.rows[0]) {
      const sendResult = result.rows[0];
      console.log("Robot Server Updated: ", sendResult);
      return sendResult;
      //Server Status Update will need to get sent.
    }
  } catch (err) {
    console.log(err);
  }
};

//Does this user own this server?
module.exports.validateOwner = async (user_id, server_id) => {
  const checkServer = await this.getRobotServer(server_id);
  if (checkServer) {
    if (user_id === checkServer.owner_id) return true;
  }
  return false;
};

//test
//this.disableRobotServer("serv-2d3630b6-4e8f-475e-8243-deef9cf70594");

module.exports.addMember = user => {
  //add user to this server as a member
};

//All server members require an invite to be a part of a server
//Open servers will automatically generate a public invite
//This invite can be revoked at anytime,
//thereby invalidating all the members that came in on that invite
module.exports.generateInvite = async invite => {
  console.log("Generating Invite for Server: ", invite);
  let validate = false;
  if (invite.user.id === invite.server.owner_id) validate = true; //simple validation, will eventually need to check for invite authority instead
  if (!validate)
    return {
      status: "error!",
      error: "You are not authorized to create this invite"
    };
  let make = {};
  make.created_by = invite.user.id;
  make.created = createTimeStamp();
  make.id = `join-${makeId()}`;
  make.server_id = invite.server.server_id;
  make.expires = invite.expires || "";

  let updateInvites = invite.server.invites;
  if (updateInvites === null || updateInvites === undefined) updateInvites = [];
  updateInvites.push(make);

  const saveInvite = await this.updateInvites(
    updateInvites,
    invite.server.server_id
  );
  if (saveInvite) return make;
  return { status: "error", error: "problem generating invite" };
};

module.exports.updateInvites = async (invites, server_id) => {
  const db = require("../services/db");
  console.log("Saving Invite...");
  const query = `UPDATE robot_servers SET invites = $1 WHERE server_id = $2 RETURNING invites`;
  try {
    const result = await db.query(query, [invites, server_id]);
    const response = result.rows[0];
    console.log("Invites Updated: ", response);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

const memberPt = [
  {
    username: "name",
    id: "userId",
    invite: {
      created_by: "default",
      id: "inviteId",
      created: "timestamp",
      expires: "timestamp"
    },
    status: { timeout: false, expireTimeout: null, roles: [""] },
    settings: {},
    joined: "timestamp",
    member: true
  }
];

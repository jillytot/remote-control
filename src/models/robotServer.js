const { makeId, createTimeStamp } = require("../modules/utilities");
const { ACTIVE_USERS_UPDATED } = require("../events/definitions");
const { logger, jsonError } = require("../modules/logging");
const log = message => {
  logger({
    message: message,
    level: "debug",
    source: "models/robotServer.js"
  });
};

//Template for robot server object
const robotServerPt = {
  serverName: "",
  serverId: "",
  ownerId: "",
  channels: [{ name: "name", id: "channelId" }], //Probably not needed here anymore
  created: "",
  settings: {},
  status: {}
};

//Used to generate / create a new robot server
module.exports.createRobotServer = async (server, user) => {
  console.log("About to build server: ", server, user);
  const { server_name } = server;

  //check for unique servername
  const checkName = await this.checkServerName(server_name);
  if (checkName)
    return { status: "error!", error: "This server name is already taken" };

  let buildServer = {};
  buildServer.owner_id = user.id;
  buildServer.server_name = server_name;
  buildServer.server_id = `serv-${makeId()}`; //Note: if server_id === 'remo', then it is refering to the global server
  buildServer.created = createTimeStamp();
  buildServer.channels = [];
  buildServer.settings = {
    default_channel: "General",
    unlisted: false,
    roles: [
      //TODO: Deprecate this structure after finishing up server members / roles / invites structure
      {
        role: "default",
        members: ["@everyone"]
      },
      { role: "owner", members: [user.id] }
    ]
  };

  buildServer.status = {
    public: true,
    liveDevices: [],
    count: 1 //Owner is first member
  };

  // "public", "unlisted", "private"

  buildServer.channels.push(await this.initChannels(buildServer));
  buildServer.settings.default_channel = buildServer.channels[0].id;
  const save = await this.saveServer(buildServer);
  if (!save) return { status: "Error!", error: "Unable to save server" };
  console.log("Generating Server: ", buildServer);
  this.pushToActiveServers(buildServer);

  console.log("GENERATE DEFAULT INVITE...");
  const { generateInvite } = require("./invites");
  const makeInvite = await generateInvite({
    user: { id: buildServer.owner_id },
    server: { server_id: buildServer.server_id, owner_id: buildServer.owner_id }
  });

  //Register server owner as member of their own server
  const { createMember } = require("./serverMembers");
  await createMember({
    owner: true,
    user_id: buildServer.owner_id,
    server_id: buildServer.server_id,
    join: makeInvite.id
  });

  return buildServer;
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
  console.log("Saving Server: ", server.server_name);
  const {
    server_id,
    server_name,
    owner_id,
    channels,
    created,
    settings,
    status
  } = server;

  const dbPut = `INSERT INTO robot_servers (server_id, server_name, owner_id, channels, created, settings, status ) VALUES($1, $2, $3, $4, $5, $6, $7 ) RETURNING *`;
  try {
    await db.query(dbPut, [
      server_id,
      server_name,
      owner_id,
      channels,
      created,
      settings,
      status
    ]);
    if (result.rows[0]) {
      this.updateRobotServer();
      return result.rows[0];
    }
  } catch (err) {
    console.log(err.stack);
  }
  return false;
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
    //console.log("Active Servers Initailized", result.rows);
    activeServers = result.rows;
  } catch (err) {
    console.log(err);
  }
};

//add a new active server to the active servers list
module.exports.pushToActiveServers = robotServer => {
  activeServers.push(robotServer);
  //console.log("Active Servers Updated: ", activeServers);
};

//return specified server from the list of active servers
module.exports.getActiveServer = server_id => {
  let pickServer = activeServers.filter(
    server => server.server_id === server_id
  );
  // console.log("Pick Active Robot Server: ", pickServer);
  return pickServer[0];
};

//Get all the robot servers currently saved in the database
module.exports.getRobotServers = async () => {
  //TODO: Some kind of sorting / capping list #
  const db = require("../services/db");
  try {
    const query = `SELECT * FROM robot_servers`;
    result = await db.query(query);
    // console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRobotServerCount = async () => {
  const db = require("../services/db");
  const count = `SELECT COUNT(*) FROM robot_servers`;
  try {
    const result = await db.query(count);
    // log("Get Active Server Count", result.rows.length);
    if (result) return result.rows[0].count;
  } catch (err) {
    console.log(err);
  }
  return "...";
};

//This sends an event to all users and triggers them to pull updated data from the API.
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

module.exports.sendRobotServerStatus = (server_id, status) => {
  log("SEND ROBOT STATUS CHECK: ", server_id, status);
  this.emitEvent(server_id, "SERVER_STATUS", status);
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

  // console.log("SENDING LOCAL TYPES: ", localTypes);
  return localTypes;
};

//Get all server information from server_id
module.exports.getRobotServer = async server_id => {
  console.log("CHECK: ", server_id);
  const db = require("../services/db");
  try {
    const query = "SELECT * FROM robot_servers WHERE server_id = $1 LIMIT 1";
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) return result.rows[0];

    // return jsonError(`Unable to find server with id: ${server_id}`);
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports.getRobotServerFromName = async name => {
  console.log("CHECK FOR SERVER by name: ", name);
  const db = require("../services/db");
  const query = "SELECT * FROM robot_servers WHERE server_name = $1 LIMIT 1";
  try {
    const result = await db.query(query, [name]);
    // console.log("RESULT: ", result.rows[0]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

//This will permanently remove a robot server from the DB
module.exports.deleteRobotServer = async server_id => {
  console.log(server_id);
  const db = require("../services/db");
  try {
    const query = "DELETE FROM robot_servers WHERE server_id =$1";
    const result = await db.query(query, [server_id]);
    console.log("Deleted row count: ", result.rowCount);

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
Cannot be overwritten by owner

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
  //console.log("Updating Robot Server Status: ", server_id);
  try {
    const update = `UPDATE robot_servers SET status = $1 WHERE server_id = $2 RETURNING *`;
    const result = await db.query(update, [status, server_id]);
    if (result.rows[0]) {
      const sendResult = result.rows[0];
      //console.log("Robot Server Updated: ", sendResult);
      return sendResult;
      //Server Status Update will need to get sent.
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.updateRobotServerSettings = async (server_id, settings) => {
  const db = require("../services/db");
  // console.log("Updating Robot Server Status: ", server_id, settings);

  try {
    const update = `UPDATE robot_servers SET settings = $1 WHERE server_id = $2 RETURNING *`;
    const result = await db.query(update, [settings, server_id]);
    if (result.rows[0]) {
      const sendResult = result.rows[0];
      // console.log("Robot Server Updated: ", sendResult);
      return sendResult;
      //Server Status Update will need to get sent.
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getRobotServerSettings = async server_id => {
  const db = require("../services/db");
  const query = `SELECT settings FROM robot_servers WHERE server_id = $1`;
  try {
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return jsonError("Unable to fetch settings");
};

//Does this user own this server?
module.exports.validateOwner = async (user_id, server_id) => {
  const checkServer = await this.getRobotServer(server_id);
  if (checkServer) {
    if (user_id === checkServer.owner_id) return true;
  }
  return false;
};

const memberPt = [
  {
    user_id: "userId",
    server_id: "serverId",
    invites: ["inviteId"],
    status: { timeout: false, expireTimeout: null, roles: [""] },
    settings: {},
    joined: "timestamp"
  }
];

//Does this servername already exist?
module.exports.checkServerName = async serverName => {
  const db = require("../services/db");
  const query = `SELECT server_name FROM robot_servers WHERE LOWER(server_name)=LOWER( $1 )`;
  try {
    const result = await db.query(query, [serverName]);
    // console.log(result.rows[0]);
    if (result.rows[0]) return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

//takes an array of strings containing server_id's, returns an array of robot_server objects
module.exports.getServerGroup = async servers => {
  // console.log(servers);
  const db = require("../services/db");
  const query = `SELECT * FROM robot_servers WHERE server_id = ANY($1::text[])`;
  try {
    const result = await db.query(query, [servers]);
    if (result.rows) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};

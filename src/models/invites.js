//Manage invites for users
const { logger, jsonError } = require("../modules/logging");
const log = message => {
  logger({
    level: "debug",
    source: "models/invites",
    message: message
  });
};

const invitePt = {
  server_id: "serverId",
  created_by: "default",
  id: "inviteId",
  created: "timestamp",
  expires: "timestamp"
};

//All server members require an invite to be a part of a server
//Open servers will automatically generate a public invite
//This invite can be revoked at anytime,
//thereby invalidating all the members that came in on that invite

module.exports.generateInvite = async invite => {
  const { makeId, createTimeStamp } = require("../modules/utilities");
  console.log(
    "Generating Invite for Server: ",
    invite.user.id,
    invite.server.server_id
  );
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
  make.status = "active";
  const checkInvites = await this.checkForInvites(make.server_id);
  if (checkInvites) {
    make.is_default = false;
    make.alias = invite.alias;
  } else {
    make.is_default = true;
  }

  const save = await this.saveInvite(make);
  if (save) return save;
  return { status: "error", error: "problem generating invite" };
};

//If server has invites, return true, else return false
module.exports.checkForInvites = async server_id => {
  const db = require("../services/db");
  // console.log("checking server for existing invites", server_id);
  const query = `SELECT * FROM invites WHERE server_id = ( $1 )`;
  try {
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.saveInvite = async invite => {
  // console.log("Saving Invite to DB");
  const db = require("../services/db");
  const {
    id,
    created_by,
    server_id,
    created,
    expires,
    status,
    alias,
    is_default
  } = invite;
  const save = `INSERT INTO invites ( id, created_by, server_id, created, expires, status, alias, is_default ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *`;
  try {
    const result = await db.query(save, [
      id,
      created_by,
      server_id,
      created,
      expires,
      status,
      alias,
      is_default
    ]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return {
    status: "Error!",
    error: "There was a problem saving invite into DB"
  };
};

module.exports.getInvitesForServer = async server_id => {
  // console.log("get invites for server: ", server_id);
  const db = require("../services/db");
  const query = `SELECT * FROM invites WHERE server_id = $1`;
  try {
    const result = await db.query(query, [server_id]);
    // console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
  return {
    status: "error!",
    error: "Could not find any invites generated for this server"
  };
};

module.exports.getInviteById = async id => {
  console.log("Get invite by id: ", id);
  const db = require("../services/db");
  const query = `SELECT * FROM invites WHERE id = $1 LIMIT 1`;
  try {
    const result = await db.query(query, [id]);
    if (result.rows[0]) {
      console.log(result.rows[0]);
      return result.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return {
    status: "error!",
    error: "Could not find any invites generated for this server"
  };
};

//Tool for retroactively adding default invites
module.exports.generateDefaults = async () => {
  const { getRobotServers } = require("./robotServer");
  let invites = [];
  try {
    const servers = await getRobotServers();
    servers.forEach(async server => {
      const invite = await this.getInvitesForServer(server.server_id);
      // console.log("INVITE CHECK: ", invite);
      if (!invite[0]) {
        // console.log("GENERATING DEFAULT INVITE ...");
        const makeInvite = await this.generateInvite({
          user: { id: server.owner_id },
          server: { server_id: server.server_id, owner_id: server.owner_id }
        });
        // console.log("Creating Default Invite: ", makeInvite);
        invites.push(makeInvite);
        return;
      }
    });
  } catch (err) {
    console.log(err);
  }
  return invites;
};

module.exports.initDefaultInvites = async () => {
  console.log(await this.generateDefaults());
};

//invite validation: make sure this user can generate this invite

module.exports.updateInviteStatus = async invite => {
  const db = require("../services/db");
  const { id, status } = invite;
  log(`Updating Invite ${id} status to ${status}`);
  const query = `UPDATE invites SET status = $1 WHERE id = $2 RETURNING *`;
  try {
    const result = await db.query(query, [status, id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    logger({
      level: "error",
      source: "models/invites",
      message: err
    });
  }
  return jsonError("Unable to update status for invite");
};

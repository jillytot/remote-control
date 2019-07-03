//Manage invites for users

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
  make.status = "active";

  const save = await this.saveInvite(make);
  if (save) return save;
  return { status: "error", error: "problem generating invite" };
};

module.exports.saveInvite = async invite => {
  console.log("Saving Invite to DB");
  const db = require("../services/db");
  const { id, created_by, server_id, created, expires, status } = invite;
  const save = `INSERT INTO invites ( id, created_by, server_id, created, expires, status ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING *`;
  try {
    const result = await db.query(save, [
      id,
      created_by,
      server_id,
      created,
      expires,
      status
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
  console.log("get invites for server: ", server_id);
  const db = require("../services/db");
  const query = `SELECT * FROM invites WHERE server_id = $1`;
  try {
    const result = await db.query(query, [server_id]);
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
  return {
    status: "error!",
    error: "Could not find any invites generated for this server"
  };
};

//invite validation: make sure this user can generate this invite
//make sure each server starts out with a default invite

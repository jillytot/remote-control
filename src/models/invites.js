//Manage invites for users

const invitePt = {
  server_id: "serverId",
  created_by: "default",
  id: "inviteId",
  created: "timestamp",
  expires: "timestamp"
};

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

//invite validation: make sure this user can generate this invite
//make sure each server starts out with a default invite

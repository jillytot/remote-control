const memberPt = {
  server_id: "",
  user_id: "",
  roles: ["@everyone"],
  status: { timeout: false, expireTimeout: null, member: false },
  settings: { notifications: false },
  joined: "timestamp",
  invites: []
};

/*
Each server contains a list of members, 
An entry is created for a user who visits a server by default, 
however member is set to false. 
They have to join the server, or follow an invite to officially become a member. 
If the server is set to privite, then all non-members will be unable to access it
Each member entry is used to handle status and settings per user per robot server.
For example, local moderation is handled here. 
Member status is sent to the user via the API / WS as "localStatus", same with "localSettings"
The client will ask for local status on whichever server they actively enter on load.
*/

module.exports.createMember = async data => {
  console.log("Let Memeber Join Server: ", data);
  const { createTimeStamp } = require("../modules/utilities");

  //const checkInvite = await this.validateInvite(data);
  //console.log("CHECKING INVITE", checkInvite);
  //if (!checkInvite) return { status: "Error!", error: "Invite is not valid" };

  const checkMembership = await this.checkMembership(data);
  if (checkMembership) return checkMembership;

  let makeMember = {};
  makeMember.user_id = data.user_id;
  makeMember.server_id = data.server_id;
  makeMember.roles = []; //default role
  makeMember.settings = {};

  if (data.join) {
    //If joining as a member w/ an invite
    makeMember.invites = [data.join];
    makeMember.status = { timeout: false, expireTimeout: null, member: true };
    makeMember.joined = createTimeStamp();
    if (data.owner) {
      makeMember.roles = ["@owner", "@member"];
    }
  } else {
    //default behavior for browsing public servers (needed to track moderation)
    makeMember.invites = [];
    makeMember.status = { timeout: false, expireTimeout: null, member: false };
    makeMember.joined = null;
  }

  const save = this.saveMember(makeMember);
  if (save) return save;

  //does this user exist already?
};

module.exports.saveMember = async member => {
  console.log("Saving new member to DB... ");
  const db = require("../services/db");
  const {
    server_id,
    user_id,
    roles,
    joined,
    status,
    settings,
    invites
  } = member;
  const save = `INSERT INTO members ( server_id, user_id, roles, joined, status, settings, invites) VALUES ( $1, $2, $3, $4, $5, $6, $7 ) RETURNING *`;
  try {
    const result = await db.query(save, [
      server_id,
      user_id,
      roles,
      joined,
      status,
      settings,
      invites
    ]);
    if (result.rows[0]) {
      console.log(result);
      return result.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return {
    status: "Error!",
    error: "There was a problem saving this member to the DB."
  };
};

//Is this user already a member?
module.exports.checkMembership = async member => {
  console.log("Checking Membership");
  const db = require("../services/db");
  const { server_id, user_id } = member;
  const check = `SELECT * FROM members WHERE ( server_id, user_id ) = ( $1, $2 )`;
  try {
    const result = await db.query(check, [server_id, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return false;
};

//TODO: Find more effecient query string for getting servers where status.member = true
module.exports.getFollowedServers = async user_id => {
  const db = require("../services/db");
  const query = `SELECT * FROM members WHERE user_id = $1`;
  try {
    const result = await db.query(query, [user_id]);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.getMember = async member => {
  const db = require("../services/db");
  console.log("get member...");
  const { server_id, user_id } = member;
  const query = `SELECT * FROM members WHERE ( server_id, user_id ) = ( $1, $2 )`;
  try {
    const result = await db.query(query, [server_id, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.deleteMember = async member => {
  const db = require("../services/db");
  console.log("removing member...");
  const { server_id, user_id } = member;
  const remove = `DELETE FROM members WHERE ( server_id, user_id ) = ( $1, $2 )`;
  try {
    const result = await db.query(remove, [server_id, user_id]);
    console.log(result.rowCount);
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports.getMembers = async server_id => {
  const db = require("../services/db");
  console.log("Get Members for Server...");
  const query = `SELECT * FROM members WHERE server_id = $1`;
  try {
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return { status: "Error!", error: "Unable to get members for server" };
};

module.exports.updateMemberStatus = async member => {
  const db = require("../services/db");
  const { status, server_id, user_id } = member;
  console.log("Updating Membership Status..");
  const update = `UPDATE members SET status = $1 WHERE ( server_id, user_id ) = ( $2, $3 ) RETURNING *`;
  try {
    const result = await db.query(update, [status, server_id, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.updateMemberInvites = async member => {
  const db = require("../services/db");
  const { invites, server_id, user_id } = member;
  console.log("Updating Membership Invites..", invites);
  const update = `UPDATE members SET invites = ( $1 ) WHERE ( server_id, user_id ) = ( $2, $3 ) RETURNING *`;
  try {
    const result = await db.query(update, [invites, server_id, user_id]);
    console.log("UPDATE INVITES CHECK: ", result.rows[0]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.updateMemberRoles = async member => {
  const db = require("../services/db");
  const { roles, server_id, user_id } = member;
  const update = `UPDATE members SET roles = ( $1 ) WHERE ( server_id, user_id ) = ( $2, $3 ) RETURNING *`;
  try {
    const result = await db.query(update, [roles, server_id, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return null;
};

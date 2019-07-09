const memberPt = {
  server_id: "",
  user_id: "",
  roles: ["@everyone"],
  status: { timeout: false, expireTimeout: null },
  settings: { notifications: false },
  joined: "timestamp",
  invites: []
};

module.exports.createMember = async data => {
  console.log("Let Memeber Join Server: ", data);
  const { createTimeStamp } = require("../modules/utilities");

  const checkInvite = await this.validateInvite(data);
  console.log("CHECKING INVITE", checkInvite);
  if (!checkInvite) return { status: "Error!", error: "Invite is not valid" };

  const checkMembership = await this.checkMembership(data);
  if (checkMembership) return checkMembership;

  let makeMember = {};
  makeMember.user_id = data.user_id;
  makeMember.server_id = data.server_id;
  makeMember.roles = ["member"]; //default role
  makeMember.joined = createTimeStamp();
  makeMember.status = memberPt.status;
  makeMember.settings = {};
  makeMember.invites = [data.join];

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

module.exports.validateInvite = async invite => {
  console.log("Validating Invite", invite);
  const { getInvitesForServer } = require("./invites");
  const checkInvite = await getInvitesForServer(invite.server_id);
  let validate = false;
  checkInvite.map(inv => {
    if (inv.id === invite.id || inv.id === invite.join) {
      validate = true;
    }
  });
  return validate;
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

//TODO: UpdateMembership
//TODO: Remove Membership

module.exports.leaveServer = async member => {
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

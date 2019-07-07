const memberPt = {
  server_id: "",
  user_id: "",
  roles: ["@everyone"],
  status: { timeout: false, expireTimeout: null },
  settings: { notifications: false },
  joined: "timestamp",
  invites: []
};

module.exports.creatMember = async data => {
  console.log("Let Memeber Join Server: ", data);
  const { createTimeStamp } = require("../modules/utilities");

  let makeMember = {};
  makeMember.user_id = data.user.id;
  makeMember.server_id = data.server.server_id;
  makeMember.roles = [server.roles[0]]; //default role
  makeMember.joined = createTimeStamp();
  makeMember.status = memberPt.status;
  makeMember.settings = {};
  makeMember.invites = [data.invite.id];

  const save = this.saveMemeber(makeMember);
  if (save) return save;

  //does this user exist already?
};

module.exports.saveMember = async member => {
  console.log("Saving new member to DB ...");
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
    const result = db.query(save, [
      server_id,
      user_id,
      roles,
      joined,
      status,
      settings,
      invites
    ]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return {
    status: "Error!",
    error: "There was a problem saving this member to the DB."
  };
};

module.exports.validateInvite = async invite => {
  console.log("Validating Invite");
  const { getInvitesForServer } = require("./invites");
  const checkInvite = await getInvitesForServer(invite.server_id);
  let validate = false;
  checkInvite.map(inv => {
    if (inv.id === invite.id) {
      validate = true;
    }
  });
  return validate;
};

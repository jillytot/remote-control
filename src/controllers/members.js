const { logger, jsonError } = require("../modules/logging");

const log = message => {
  logger({
    level: "debug",
    source: "controllers/members.js",
    message: message
  });
};

//TODO: Ensure that users cannot join private servers using the default invite.
module.exports.joinServer = async member => {
  const {
    updateMemberInvites,
    updateMemberStatus,
    getMember,
    createMember,
    updateMemberRoles
  } = require("../models/serverMembers");
  const { getRobotServer } = require("../models/robotServer");

  console.log("Joining Server");

  if (member.status && member.status.member)
    return { status: "Error!", error: "this user is already a member" };

  const validate = await this.validateInvite({
    id: member.join,
    server_id: member.server_id
  });

  const join = member.join;
  let checkMembership = await getMember(member);
  if (!checkMembership) {
    checkMembership = await createMember(member);
  }
  if (validate && checkMembership) {
    member = checkMembership;
    member.status.member = true;
    let { roles, invites } = member;

    member = await updateMemberStatus(member);

    roles.push("member");
    roles = Array.from(new Set(roles)); //no dupes
    member.roles = roles;
    member = await updateMemberRoles(member);

    invites.push(join);
    invites = Array.from(new Set(invites)); //no dupes
    member.invites = invites;
    member = await updateMemberInvites(member);

    const robotServer = await getRobotServer(member.server_id);
    this.updateMemberCount(robotServer);

    return member;
  }
  return validate;
};

module.exports.leaveServer = async member => {
  const {
    getMember,
    updateMemberInvites,
    updateMemberStatus,
    updateMemberRoles
  } = require("../models/serverMembers");
  const { getRobotServer } = require("../models/robotServer");

  console.log("Leaving Server");
  member = await getMember(member);
  const robotServer = await getRobotServer(member.server_id);
  if (member.user_id === robotServer.owner_id) return member; //SERVER OWNERS CANNOT LEAVE THEIR OWN SERVER

  member.status.member = false;
  member = await updateMemberStatus(member);

  member.invites = [];
  member = await updateMemberInvites(member);

  member.roles = [];
  member = await updateMemberRoles(member);

  this.updateMemberCount(robotServer);

  return member;
};

const isOwner = member => {
  member.user_id;
};

//Checks to make sure this particular invite is valid.
module.exports.validateInvite = async invite => {
  // console.log("Validating Invite", invite);
  const { getInvitesForServer } = require("../models/invites");
  const checkInvite = await getInvitesForServer(invite.server_id);
  let validate = false;
  checkInvite.map(inv => {
    if (inv.id === invite.id || inv.id === invite.join) {
      validate = true;
    }
  });
  return validate;
};

//This method was updated to use invite.alias instead of invite.id
module.exports.validateServerInvite = async invite_id => {
  log(`Validate Invite for Server: ${invite_id}`);
  const { getInviteByAlias } = require("../models/invites");
  const invite = await getInviteByAlias(invite_id);
  //Check status:
  if (invite.error) {
    log(`Invite validation Error for invite id: ${invite_id}`);
    return null;
  }
  if (invite.status !== "active") {
    log(`Invite no longer active: ${invite.id}`);
    return null;
  }
  if (invite.expires && invite.expires <= Date.now()) {
    log(`Invite ${invite_id} has expired, deactivating Invite`);
    await this.deactivateInvite(invite);
    return null;
  }
  log(`Invite Validated ${invite_id}`);
  return invite;
};

module.exports.getInviteInfoFromId = async invite_id => {
  const { getInviteById } = require("../models/invites");
  const invite = await getInviteById(invite_id);
  return invite;
};

module.exports.getInviteInfoFromAlias = async alias => {
  const { getInviteByAlias } = require("models/invites");
  const invite = await getInviteByAlias(alias);
  return invite;
};

module.exports.deactivateInvite = async invite => {
  const { updateInviteStatus } = require("../models/invites");
  if (invite && invite.id && !invite.is_default) {
    invite.status = "inactive";
    const update = await updateInviteStatus(invite);
    if (!update.error) return update;
  }
  return null;
};

module.exports.getMemberCount = async server_id => {
  const { getMembers } = require("../models/serverMembers");
  const members = await getMembers(server_id);
  let count = 0;
  members.forEach(member => {
    if (member.status.member === true) count++;
  });
  return count;
};

module.exports.updateMemberCount = async robotServer => {
  const {
    updateRobotServerStatus,
    sendRobotServerStatus
  } = require("../models/robotServer");
  const { server_id } = robotServer;

  const updateMemberCount = await this.getMemberCount(server_id);

  robotServer.status.count = updateMemberCount;
  // console.log("UPDATING ROBOT STATUS / COUNT: ", robotServer.status);
  const updateStatus = await updateRobotServerStatus(
    server_id,
    robotServer.status
  );

  if (updateStatus) {
    sendRobotServerStatus(server_id, robotServer.status);
  }
};

module.exports.makeInvite = async ({ user, server_id, expires }) => {
  console.log(user, server_id);
  //authorize invite
  const { getRobotServer } = require("../models/robotServer");
  const { generateInvite } = require("../models/invites");
  const checkServer = await getRobotServer(server_id);

  //temporary until i make role based auth system
  if (checkServer.owner_id === user.id) {
    let invite = {};
    invite.user = user;
    invite.server = checkServer;
    invite.alias = await this.makeInviteAlias();
    if (expires) invite.expires = expires;
    invite = await generateInvite(invite);
    return invite;
  }
  return null;
};

//returns a 7 digit string, base 36
module.exports.makeInviteAlias = async testData => {
  const { checkAlias } = require("../models/invites");
  const alias =
    testData ||
    Math.random()
      .toString(36)
      .substring(2, 5) +
      Math.random()
        .toString(36)
        .substring(2, 6);
  // console.log(alias);
  const check = await checkAlias(alias);
  if (check) {
    console.log(`Alias ${alias} is already in use, generating new alias`);
    return this.makeInviteAlias();
  }
  return alias;
};

module.exports.getMembers = async server_id => {
  const { getMembers } = require("../models/serverMembers");
  const members = await getMembers(server_id);
  return members;
};

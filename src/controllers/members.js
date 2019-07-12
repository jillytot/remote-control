module.exports.joinServer = async member => {
  const {
    updateMemberInvites,
    updateMemberStatus,
    getMember,
    createMember
  } = require("../models/serverMembers");
  console.log("Joining Server");
  //   console.log(member);

  if (member.status && member.status.member)
    return { status: "Error!", error: "this user is already a emember" };

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
    member.invites.push(join);
    member = await updateMemberStatus(member);
    member = await updateMemberInvites(member);
    return member;
  }
  return validate;
};

module.exports.leaveServer = async member => {
  const {
    updateMemberInvites,
    updateMemberStatus
  } = require("../models/serverMembers");
  console.log("Leaving Server");
  member.status.member = false;
  member.invites = [];
  member = await updateMemberStatus(member);
  member = await updateMemberInvites(leave);
  return member;
};

module.exports.validateInvite = async invite => {
  console.log("Validating Invite", invite);
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

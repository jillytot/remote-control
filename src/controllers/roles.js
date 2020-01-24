const { jsonError } = require("../modules/logging");

//Manage & Verify member roles for server.

//local roles, global roles
//default owner
//can add moderator

//LOCAL ROLES
module.exports.authLocal = async (user, server, role) => {
  console.log("Checking Roles: ");
  if (user.id === server.owner_id) return { authorized: true };
  return jsonError("Not authorized");
};

//GLOBAL ROLES

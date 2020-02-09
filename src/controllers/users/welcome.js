module.exports.setWelcomeFalse = async user => {
  const { jsonError } = require("../../modules/logging");
  const { updateStatus, getUserInfoFromId } = require("../../models/user");
  try {
    let getUser = await getUserInfoFromId(user.id);
    getUser.status.displayWelcome = false;
    const update = updateStatus(getUser);
    if (update && !update.error) return true;
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem accessing user info from server");
};

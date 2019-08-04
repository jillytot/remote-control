const { VALIDATED } = require("./definitions");
const user = require("../models/user");

module.exports = async (ws, data) => {
  const getUser = await user.authUser(data.token);
  if (getUser) {
    //setup private user sub for user events
    ws.user = user.publicUser(getUser);
    console.log("AUTH USER: ", ws.user.username);

    //Confirm Validation:
    ws.emitEvent(VALIDATED, {
      username: getUser.username,
      id: getUser.id,
      status: getUser.status
    });
  } else {
    ws.emitEvent(VALIDATED, null); //for frontend to redirect to login
  }
};

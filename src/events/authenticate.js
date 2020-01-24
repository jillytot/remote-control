const { VALIDATED } = require("./definitions");
const user = require("../models/user");

module.exports = async (ws, data) => {
  const wss = require("../services/wss");
  const getUser = await user.authUser(data.token);
  if (getUser) {
    //setup private user sub for user events
    ws.user = user.publicUser(getUser);
    console.log("AUTH USER: ", ws.user.username);

    const internalUsernameBanned = wss.internalBannedUsernames.includes(
      getUser.username
    );
    const internalIpBanned = wss.internalBannedIps.includes(ws.ip);

    if (internalUsernameBanned || internalIpBanned) {
      ws.emitEvent("ALERT", "You have been banned from remo.tv");
      ws.close(1000);
    } else {
      ws.emitEvent(VALIDATED, {
        username: getUser.username,
        id: getUser.id,
        status: getUser.status
      });
    }
    //Confirm Validation:

    wss.emitInternalEvent("userAuthenticated", {
      username: getUser.username,
      id: getUser.id,
      alt: data.alt,
      ip: ws.ip,
      internalUsernameBanned,
      internalIpBanned
    });
  } else {
    ws.emitEvent(VALIDATED, null); //for frontend to redirect to login
  }
};

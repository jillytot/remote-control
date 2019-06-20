const { VALIDATED } = require("./definitions");

module.exports = (ws, data) => {
    const getUser = await user.authUser(data.token);
    if (getUser) {
      //setup private user sub for user events
      ws.user = getUser;


      //Confirm Validation:
      ws.emitEvent(VALIDATED, {
        username: getUser.username,
        id: getUser.id
      });
    }
}
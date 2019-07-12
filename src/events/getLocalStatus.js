module.exports = async (ws, data) => {
  console.log("GET LOCAL STATUS ", data, ws.user);

  const { checkMembership, createMember } = require("../models/serverMembers");
  const { server_id, user_id } = data;
  if (user_id === ws.user.id) {
    let getLocalStatus = await checkMembership({
      server_id: server_id,
      user_id: user_id
    });

    if (!getLocalStatus) {
      //TODO: Only create a default member is server is open!
      getLocalStatus = await createMember({
        user_id: user_id,
        server_id: server_id
      });
    }

    ws.user.localStatus = getLocalStatus.status;
    console.log(ws.user.localStatus);
    ws.emitEvent("SEND_LOCAL_STATUS", getLocalStatus.status);
  }
};

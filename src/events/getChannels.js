const { SEND_ROBOT_SERVER_INFO } = require("./definitions");
const { getChannels } = require("../models/channel");
const { sendActiveUsers } = require("../models/user");
const { getInvitesForServer } = require("../models/invites");

module.exports = async (ws, data) => {
  // console.log("GET CHAT ROOMS: ", data);
  ws.server_id = data.server_id;

  const sendInfo = {
    channels: await getChannels(data.server_id),
    users: await sendActiveUsers(data.server_id),
    invites: await getInvitesForServer(data.server_id)
  };

  // ws.user[data.server_id] = sendInfo.invites;
  // console.log(ws.user);
  ws.emitEvent(SEND_ROBOT_SERVER_INFO, sendInfo);
};

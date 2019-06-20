const { SEND_ROBOT_SERVER_INFO } = require("./definitions");

module.exports = async (ws, data) => {
  console.log("GET CHAT ROOMS: ", data);
  //NOTE: socket.join(data.server_id);
  const sendInfo = {
    channels: await getChannels(data.server_id),
    users: await sendActiveUsers(data.server_id)
  };

  ws.emitEvent(SEND_ROBOT_SERVER_INFO, sendInfo);
};

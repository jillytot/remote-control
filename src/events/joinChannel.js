module.exports = (ws, channel_id) => {
  const { updateChannelStatus } = require("../controllers/robots");
  if (ws.robot) {
    updateChannelStatus({ robot: ws.robot, channel_id: channel_id });
  }
  ws.channel_id = channel_id;
};

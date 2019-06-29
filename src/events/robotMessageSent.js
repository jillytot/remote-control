const { createMessage } = require("../models/chatMessage");

module.exports = async (ws, message) => {
  console.log("Robot Message Received: ", message);

  const { getUserInfoFromId, publicUser } = require("../models/user");
  message.user = { "username": ws.robot.name, "id": ws.robot.id };
  message.type = "robot";
  createMessage(message);
};

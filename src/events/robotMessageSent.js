const { createMessage } = require("../models/chatMessage");

module.exports = async (ws, message) => {
  if (ws.robot) {
    console.log("Robot Message Received: ", message);
    const { getUserInfoFromId, publicUser } = require("../models/user");
    message.user = { "username": ws.robot.name, "id": ws.robot.id };
    message.type = "robot";
    createMessage(message);
  } else {
    console.log("Robot Message Rejected (not authed): ", message);
  }
};

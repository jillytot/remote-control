const { createRobotMessage } = require("../models/chatMessage");

module.exports = async (ws, message) => {
  if (ws.robot) {
    // console.log("Robot Message Received: ", message, ws.robot);
    message.robot = ws.robot;
    message.type = "robot";
    createRobotMessage(message);
  } else {
    console.log("Robot Message Rejected (not authed): ", message);
  }
};

const { createRobotMessage } = require("../models/chatMessage");

const testMessage = {
  message: "I am a robot, beep boop bop",
  robot: {
    name: "fartyBot",
    id: "rbot-47300f3b-1258-4c7c-b2a9-f97bd81b1d81",
    owner_id: "user-2791c4f8-8b0b-40c5-8f21-709217321a6c"
  },
  chatId: "chat-5dddf758-d393-4ee8-8f66-d362987a2611",
  server_id: "serv-7e2c6372-b985-401f-8f51-991ea6cd7456",
  type: "robot"
};

createRobotMessage(testMessage);

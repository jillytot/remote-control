module.exports.getActiveUsers = () => {
  const wss = require("../services/wss");
  let users = [];
  wss.clients.forEach(ws => {
    if (ws.user && ws.user.id) {
      users.push(ws.user.id);
    }
  });
  users = Array.from(new Set(users)); //no dupes
  console.log("ACTIVE USERS: ", users, users.length);
  if (users) return users.length;
  return 0;
};

module.exports.getActiveRobots = async () => {
  const wss = require("../services/wss");
  let robots = [];
  wss.clients.forEach(ws => {
    if (ws.robot && ws.robot.id) {
      robots.push(ws.robot.id);
    }
  });
  robots = Array.from(new Set(robots)); //no dupes
  console.log("ACTIVE ROBOTS: ", robots, robots.length);
  if (robots) return robots.length;
  return 0;
};

module.exports.getTotalUserCount = async () => {
  const { getTotalUserCount } = require("../models/user");
  const count = await getTotalUserCount();
  console.log("TOTAL USER COUNT: ", count);
  return count;
};

module.exports.getRobotServerCount = async () => {
  const { getRobotServerCount } = require("../models/robotServer");
  const count = await getRobotServerCount();
  console.log("TOTAL ROBOT SERVER COUNT: ", count);
  return count;
};

module.exports.getTotalRobotCount = async () => {
  const { getTotalRobotCount } = require("../models/robot");
  const count = await getTotalRobotCount();
  console.log("TOTAL ROBOT COUNT: ", count);
  return count;
};

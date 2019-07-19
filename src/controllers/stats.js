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

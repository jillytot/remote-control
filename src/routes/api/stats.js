const router = require("express").Router();
const {
  getActiveUsers,
  getActiveRobots,
  getTotalUserCount,
  getRobotServerCount,
  getTotalRobotCount
} = require("../../controllers/stats");

router.get("/", async (req, res) => {
  console.log("Get Stats!");
  res.send({
    activeUsers: await getActiveUsers(),
    totalUsers: await getTotalUserCount(),
    totalServers: await getRobotServerCount(),
    activeDevices: await getActiveRobots(),
    registeredDevices: await getTotalRobotCount()
  });
});

module.exports = router;

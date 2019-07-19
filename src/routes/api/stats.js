const router = require("express").Router();
const { getActiveUsers, getActiveRobots } = require("../../controllers/stats");

router.get("/", async (req, res) => {
  console.log("Get Stats!");

  res.send({
    activeUsers: await getActiveUsers(),
    totalUsers: "...",
    totalServers: "...",
    activeDevices: await getActiveRobots(),
    registeredDevices: "..."
  });
});

module.exports = router;

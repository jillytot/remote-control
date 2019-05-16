const router = require("express").Router();
const {
  createRobotServer,
  getRobotServers
} = require("../../models/robotServer");

const { getChatRooms } = require("../../models/chatRoom");

router.post("/create", async (req, res) => {
  // post request
  console.log("Generating Robot Server ", req.body);
  const buildRobotServer = await createRobotServer(req.body);
  buildRobotServer !== null
    ? res.send(buildRobotServer)
    : res.send("Error generating server");
});

router.get("/list", async (req, res) => {
  let display = await getRobotServers();
  res.send(display);
});

module.exports = router;

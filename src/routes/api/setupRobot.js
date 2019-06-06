const router = require("express").Router();

const { createRobot } = require("../../models/robot");

router.get("/setup", async (req, res) => {
  console.log("Send Robot Object");
});

router.post("/setup", async (req, res) => {
  console.log("Make Robot API start", req.body);
  const getRobot = await createRobot(req.body);
  res.send(getRobot);
});

module.exports = router;

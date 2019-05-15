const router = require("express").Router();
const { createRobotServer } = require("../../models/robotServer");

router.post("/create", async (req, res) => {
  // post request
  console.log("Generating Robot Server ", req.body);
  const buildRobotServer = await createRobotServer(req.body);
  buildRobotServer !== null
    ? res.send(buildRobotServer)
    : res.send("Error generating server");
});

module.exports = router;

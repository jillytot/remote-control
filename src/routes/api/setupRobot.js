const router = require("express").Router();
const { createRobot, deleteRobot } = require("../../models/robot");
const auth = require("../auth");
const { jsonError } = require("../../modules/logging");

router.get("/setup", async (req, res) => {
  res.send({
    username: "<Your User Name>", //This probably won't be needed
    robot_name: "<Name of Your Robot>",
    host_id: "<ID Of Server to host this robot>"
  });
  console.log("Send Robot Object");
});

router.post("/setup", auth({ user: true }), async (req, res) => {
  const { validateRobotName } = require("../../controllers/validate");

  let response = {};
  if (req.body.robot_name && req.body.host_id) {
    let robot_name = validateRobotName(req.body.robot_name);
    if (robot_name.error) {
      res.send(robot_name);
      return;
    }
  } else {
    res.send(jsonError("robot_name & host_id are required"));
  }
  response.result = await createRobot({
    robot_name: req.body.robot_name,
    host_id: req.body.host_id,
    owner: req.user
  });
  res.send(response);
  return;
});

router.post("/delete", auth({ user: true }), async (req, res) => {
  let response = {};
  if (
    req.body.robot_id &&
    req.body.host_id &&
    req.user.id === req.body.owner_id
  ) {
    const result = await deleteRobot({
      id: req.body.robot_id,
      host_id: req.body.host_id
    });
    response.status = result.status;
    res.send(response);
    return;
  }
  res.send(jsonError("Unable to delete robot."));
});

router.post("/key", auth({ user: true }), async (req, res) => {
  const { createRobotAuth } = require("../../models/robot");
  let response = {};
  if (req.body.robot_id) {
    try {
      response.key = await createRobotAuth(req.body.robot_id);
      response.status = "success!";
    } catch (err) {
      console.log(err);
      response.status = "error";
    }
  } else {
    (response.status = "error"), (response.error = "Problem Generating Token");
  }
  res.send(response);
});

router.post("/auth", async (req, res) => {
  let response = {};
  const { authRobot } = require("../../models/robot");
  try {
    let getRobot = await authRobot(req.body.token);
    if (getRobot) {
      response.status = "success!";
      response.robot = getRobot;
    } else {
      response.status = "error";
      response.error = "unable to authorize robot";
    }
  } catch (err) {
    console.log(err);
  }
  res.send(response);
});

module.exports = router;

const router = require("express").Router();
const Joi = require("joi");
const { createRobot, deleteRobot } = require("../../models/robot");
const auth = require("../auth");

//Use authorization head over body
const schema = Joi.object().keys({
  robot_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

router.get("/setup", async (req, res) => {
  res.send({
    username: "<Your User Name>", //This probably won't be needed
    robot_name: "<Name of Your Robot>",
    host_id: "<ID Of Server to host this robot>"
  });
  console.log("Send Robot Object");
});

router.post("/setup", auth, async (req, res) => {
  console.log(req.body);
  let response = {};
  if (req.body.robot_name && req.body.host_id) {
    response.validate = await Joi.validate(
      { robot_name: req.body.robot_name },
      schema
    );

    if (!response.validate) {
      response.status = "error";
      res.send(response);
      return;
    }
  } else {
    response.status = "error";
    response.error = "insuffecient information to make this request";
  }

  //Make sure this user is a real user, this user owns the server

  response.result = await createRobot({
    robot_name: req.body.robot_name,
    host_id: req.body.host_id,
    owner: req.user
  });
  res.send(response);
  return;
});

router.post("/delete", auth, async (req, res) => {
  console.log(req.body);
  let response = {};
  console.log;
  if (
    req.body.robot_id &&
    req.body.host_id &&
    req.user.id === req.body.owner_id
  ) {
    console.log("DELETING ROBOT: ", req.body.robot);
    const result = await deleteRobot({
      id: req.body.robot_id,
      host_id: req.body.host_id
    });
    response.status = result.status;
  } else {
    response.status = "error";
    response.error = "Cannot delete robot";
  }
  res.send(response);
});

router.post("/key", auth, async (req, res) => {
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

module.exports = router;

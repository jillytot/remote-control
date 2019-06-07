const router = require("express").Router();
const Joi = require("joi");
const { createRobot } = require("../../models/robot");
const auth = require("../auth");

//Use authorization head over body
schema = Joi.object().keys({
  robot_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

router.get("/setup", async (req, res) => {
  res.send({
    username: "<Your User Name>", //This probably won't be needed
    robot_name: "<Name of Your Robot>"
  });
  console.log("Send Robot Object");
});

router.post("/setup", auth, async (req, res) => {
  console.log(req.token);
  console.log("Make Robot API start", req.body);
  const result = Joi.validate({ robot_name: req.body.robot_name }, schema);
  if (result.error) {
    res.send({
      status: result.error.name,
      error: result.error.details[0].message
    });
    return;
  }

  const getRobot = await createRobot(req.body);
  res.send(getRobot);
  return;
});

module.exports = router;

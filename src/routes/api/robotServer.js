const router = require("express").Router();
const {
  createRobotServer,
  getRobotServers
} = require("../../models/robotServer");
const auth = require("../auth");
const Joi = require("joi");

router.get("/create", (req, res) => {
  const response = {
    server_name: "required",
    authorization: "Bearer token must be included in authorization headers"
  };
  res.send(response);
  return;
});

router.post("/create", auth, async (req, res) => {
  // post request
  console.log("Generating Robot Server ", req.body, req.token);
  const result = Joi.validate({ server_name: req.body.server_name }, schema);

  console.log("Joi validation result: ", result);
  if (result.error !== null) {
    res.send("stop messing with the API Ged, i know it's you!");
    return;
  }
  const buildRobotServer = await createRobotServer(req.body, req.token);
  buildRobotServer !== null
    ? res.send(buildRobotServer)
    : res.send("Error generating server");
});

router.get("/list", async (req, res) => {
  let display = await getRobotServers();
  res.send(display);
});

module.exports = router;

const schema = Joi.object().keys({
  server_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

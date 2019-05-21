const router = require("express").Router();
const {
  createRobotServer,
  getRobotServers
} = require("../../models/robotServer");

const { getChatRooms } = require("../../models/chatRoom");

const Joi = require("joi");

router.post("/create", async (req, res) => {
  // post request
  console.log("Generating Robot Server ", req.body);
  const result = Joi.validate({ serverName: req.body.serverName }, schema);
  console.log("Joi validation result: ", result);
  if (result.error !== null) {
    res.send("stop messing with the API Ged, i know it's you!");
    return;
  }
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

schema = Joi.object().keys({
  // owner_id: "0",
  serverName: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
  // server_id: "serv-c73dbdb9-c7d6-4d7c-a139-229d229bd2b5",
  // created: 1558406095210,
  // channels: ["Welcome", "General"]
});

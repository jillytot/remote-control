const router = require("express").Router();
const {
  createRobotServer,
  getRobotServers,
  getRobotServer,
  deleteRobotServer,
  updateRobotServer
} = require("../../models/robotServer");
// const { publicUser, validateUser } = require("../../models/user");
const auth = require("../auth");
const Joi = require("joi");

//LIST ACTIVE SERVERS
router.get("/list", async (req, res) => {
  let display = await getRobotServers();
  res.send(display);
});

//CREATE SERVER
router.get("/create", (req, res) => {
  const response = {
    server_name: "required",
    authorization: "Bearer token must be included in authorization headers"
  };
  res.send(response);
});

router.post("/create", auth, async (req, res) => {
  console.log("Generating Robot Server ", req.body, req.token);
  const result = Joi.validate({ server_name: req.body.server_name }, schema);

  console.log("Joi validation result: ", result);
  if (result.error !== null) {
    res.send({ error: `Could not save server: ${req.body.server_name}` });
    return;
  }
  const buildRobotServer = await createRobotServer(req.body, req.token);
  buildRobotServer !== null
    ? res.send(buildRobotServer)
    : res.send("Error generating server");
});

//REMOVE SERVER
router.get("/delete", async (req, res) => {
  const response = {
    server_id: "required"
  };
  res.send(response);
});

router.post("/delete", auth, async (req, res) => {
  console.log("API / Robot Server / Delete: ", req.body);
  let response = {};

  if (req.user) {
    response.validated = true;
    const robotServerToDelete = await getRobotServer(req.body.server_id);
    if (robotServerToDelete && req.user.id === robotServerToDelete.owner_id) {
      response.deleting = req.body.server_id;
      try {
        if (await deleteRobotServer(req.body.server_id)) {
          response.success = `Server successfully Deleted`;
          updateRobotServer();
        } else {
          response.error = "There was a problem deleting the server";
        }
      } catch (err) {
        console.log(err);
        response.error = "Could not Delete Server";
      }
    } else {
      response.error = "Could not Delete Server";
    }
  } else {
    response.error = "Invalid User";
  }

  res.send(response);
});

module.exports = router;

const schema = Joi.object().keys({
  server_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

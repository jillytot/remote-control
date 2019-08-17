const router = require("express").Router();
const {
  createRobotServer,
  getRobotServer,
  deleteRobotServer,
  updateRobotServer
} = require("../../models/robotServer");

const { checkTypes } = require("../../models/user");
const auth = require("../auth");
const Joi = require("joi");

//LIST ACTIVE SERVERS
router.get("/list", async (req, res) => {
  const { getPublicServers } = require("../../controllers/robotServer");
  let display = await getPublicServers();
  res.send(display);
});

router.get("/members", async (req, res) => {
  let response = {};
  const { getMembers } = require("../../models/serverMembers");
  if (req.body.server_id) {
    const listMembers = await getMembers(req.body.server_id);
    response = listMembers;
  } else {
    response.status = "Error!";
    response.error = "Unable to get members";
  }
  res.send(response);
});

//CREATE SERVER
router.get("/create", (req, res) => {
  const response = {
    server_name: "required",
    authorization: "Bearer token must be included in authorization headers"
  };
  res.send(response);
});

//generate invite for a server, right now only owner can make this
router.post("/invite", auth({ user: true }), async (req, res) => {
  let response = {};
  if (req.user && req.body.server_id) {
    let invite = {};
    invite.user = req.user;
    if (req.body.expires) invite.expires = req.body.expires;
    const { getRobotServer } = require("../../models/robotServer");
    const { generateInvite } = require("../../models/invites");
    invite.server = await getRobotServer(req.body.server_id);
    const makeInvite = await generateInvite(invite);
    response.invite = makeInvite;
    res.send(response);
    return;
  }
  (response.status = "error"), (response.error = "Unable to generate invite");
  res.send(response);
});

//JOIN SERVER, MAIN METHOD FOR JOINING PUBLICLY LISTED SERVERS
router.post("/join", auth({ user: true }), async (req, res) => {
  const { joinServer } = require("../../controllers/members");
  let response = {};
  if (req.user && req.body.join && req.body.server_id) {
    const join = await joinServer({
      user_id: req.user.id,
      server_id: req.body.server_id,
      join: req.body.join
    });

    if (join) {
      response = join;
      res.send(join);
      return;
    }
  }

  response.status = "Error!";
  response.error = "Unable to join server with provided information";
  res.send(response);
});

//LEAVE SERVER, DOES NOT DELETE USER FROM MEMBERLIST
router.post("/leave", auth({ user: true }), async (req, res) => {
  const { leaveServer } = require("../../controllers/members");
  let response = {};
  if (req.user && req.body.join && req.body.server_id) {
    const leave = await leaveServer({
      user_id: req.user.id,
      server_id: req.body.server_id,
      join: req.body.join
    });

    if (leave) {
      response = leave;
      res.send(response);
      return;
    }
  }
  response.status = "Error!";
  response.error = "Unable to leave server";
  res.send(response);
});

//THIS WILL COMPLETELY REMOVE A MEMBER FROM A SERVER & CONSEQUENTLY REMOVE ALL THEIR DATA
router.post("/delete-member", auth({ user: true }), async (req, res) => {
  const { deleteMember } = require("../../models/serverMembers");
  let response = {};
  if (req.user && req.body.server_id) {
    const leave = await deleteMember({
      user_id: req.user.id,
      server_id: req.body.server_id
    });
    if (leave) {
      response.status = "Success";
      response.result = `Successfully Left Server ${req.body.server_id}`;
    } else {
      (response.status = "Error!"),
        (response.error = "Unable to leave server...");
    }
  }
  res.send(response);
});

//get list of invites for a specific server, right now only owner can request
router.get("/invites", auth({ user: true }), async (req, res) => {
  const { getInvitesForServer } = require("../../models/invites");
  if (req.user && req.body.server_id) {
    let getInvites = await getInvitesForServer(req.body.server_id);
    res.send(getInvites);
  }
});

router.post("/settings/listing", auth({ user: true }), async (req, res) => {
  const { updateListing } = require("../../controllers/robotServer");

  if (req.body.server.settings) {
    // console.log("INPUT CHECK: ", req.body.server);
    const update = await updateListing(req.body.server, req.user.id);

    if (update) res.send(update);
    return;
  }
  res.send({
    status: "Error!",
    error: "There was a problem updating server listing"
  });
});

router.post("/get-server", async (req, res) => {
  const { getServerByName } = require("../../controllers/robotServer");
  if (req.body.server_name) {
    const getServer = await getServerByName(req.body.server_name);
    if (getServer) res.send(getServer);
    return;
  }
  res.send({ status: "Error!", error: "Unable to find server" });
});

router.post("/create", auth({ user: true }), async (req, res) => {
  console.log("Generating Robot Server ", req.body, req.user);
  const result = Joi.validate({ server_name: req.body.server_name }, schema);

  console.log("Joi validation result: ", result);
  if (result.error !== null) {
    res.send({ error: `Could not save server: ${req.body.server_name}` });
    return;
  }
  const buildRobotServer = await createRobotServer(req.body, req.user);
  res.send(buildRobotServer);
});

//REMOVE SERVER
router.get("/delete", async (req, res) => {
  const response = {
    server_id: "required"
  };
  res.send(response);
});

router.post("/delete", auth({ user: true }), async (req, res) => {
  console.log("API / Robot Server / Delete: ", req.body);
  let response = {};

  if (req.user) {
    const robotServerToDelete = await getRobotServer(req.body.server_id);
    const moderator = await checkTypes(req.user, ["staff, global_moderator"]);
    if (
      (robotServerToDelete && req.user.id === robotServerToDelete.owner_id) ||
      moderator
    ) {
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
      response.error = "Insuffecient privileges to delete server";
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

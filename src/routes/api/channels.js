const router = require("express").Router();
const auth = require("../auth");
const Joi = require("joi");
const {
  createChannel,
  getChannels,
  getServerIdFromChannelId,
  deleteChannel
} = require("../../models/channel");
const { validateOwner } = require("../../models/robotServer");
const { publicUser } = require("../../models/user");

const schema = Joi.object().keys({
  channel_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

router.get("/list/:id", async (req, res) => {
  let response = {};
  const result = await getChannels(req.params.id);
  if (result) {
    response.channels = result;
  } else {
    response.error = "unable to get channels for specified server";
  }
  res.status(200).send(response);
});

router.get("/create", async (req, res) => {
  let response = {};
  response.server_id = "<Please provide a server_id to add channel too >";
  response.channel_name = "<Please provide a name for your new channel>";
  response.authorization = "required";
  res.status(200).send(response);
});

router.post("/create", auth({ user: true }), async (req, res) => {
  const { validateChannelName } = require("../../controllers/validate");
  let response = {};
  let makeChannel = {};

  if (req.body.server_id && req.body.channel_name && req.user) {
    const checkName = validateChannelName(req.body.channel_name);
    if (checkName.error) {
      res.send(checkName);
      return;
    }
    response.user = { username: req.user.username, id: req.user.id };
    response.server_id = req.body.server_id;
    response.channel_name = req.body.channel_name;

    const getServer = await validateOwner(response.user.id, response.server_id);

    if (getServer) {
      response.validated = true;
    } else {
      response.error = "user does not appear to own this server.";
    }
  } else {
    response.error = "unable to determine user information.";
  }

  try {
    //TODO: Add default chatroom if none is provided
    makeChannel = await createChannel({
      host_id: req.body.server_id,
      name: checkName
    });

    if (makeChannel) {
      response.success = "Channel successfully created!";
      response.channel = makeChannel;
    }
  } catch (err) {
    response.error = "There was a problem creating this channel";
    response.error_details = makeChannel;
  }

  if (!response.error) res.status(201).send(response);
  res.send(response);
  console.log(response);
});

router.get("/delete", async (req, res) => {
  response = {};
  response.channel_id = "<Channel ID Required>";
  response.authorization = "<Authorization Required>";

  res.status(200).send(response);
  console.log(response);
});

//Delete Channel
router.post("/delete", auth({ user: true }), async (req, res) => {
  console.log("DELETING CHANNEL: ", req.body.channel_id);
  let response = {};
  if (req.body.channel_id && req.body.server_id && req.user)
    response.channel_id = req.body.channel_id;
  response.server_id = req.body.server_id;
  response.user = { username: req.user.username, id: req.user.id };

  validate = await validateOwner(req.user.id, response.server_id);
  if (validate) {
    response.validated = true;
    // response.validate = true;
    const result = await deleteChannel(req.body.channel_id, req.body.server_id);
    response.status = result.status;
  }
  if (!response.error) res.status(200).send(response);
  res.send(response);
});

module.exports = router;

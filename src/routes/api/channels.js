const router = require("express").Router();
const auth = require("../auth");
const Joi = require("joi");
const { createChannel, getChannels } = require("../../models/channel");
const { validateOwner } = require("../../models/robotServer");

const schema = Joi.object().keys({
  channel_name: Joi.string()
    .regex(/[\w\s]+/)
    .min(3)
    .max(30)
    .required()
});

router.get("/list", async (req, res) => {
  let response = {};
  const result = await getChannels(req.body.server_id);
  if (result) {
    response.channels = result;
  } else {
    response.error = "unable to get channels for specified server";
  }
  res.send(response);
  console.log(response);
});

router.get("/create", async (req, res) => {
  let response = {};
  let user_id = "";
  let server_id = "";
  response.server_id = "<Please provide a server_id to add channel too >";
  response.channel_name = "<Please provide a name for your new channel>";
  response.authorization = "required";
  res.send(response);
});

router.post("/create", auth, async (req, res) => {
  let response = {};
  response.req = req.body;

  if (!req.body.server_id) {
    response.error = "Please provide a server_id to add a channel to";
    res.send(response);
    return;
  }

  server_id = req.body.server_id;

  if (!req.body.channel_name) {
    response.error = "please provide a valid channel name";
    res.send(response);
    return;
  }

  if (req.user) {
    user_id = req.user.id;
    const getServer = await validateOwner(user_id, server_id);
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
    const makeChannel = await createChannel({
      host_id: server_id,
      name: req.body.channel_name
    });

    if (makeChannel) {
      response.success = "Channel successfully created!";
      response.channel = makeChannel;
    }
  } catch (err) {
    response.error = "There was a problem creating this channel";
    response._error = err;
  }

  res.send(response);
  console.log(response);
});

module.exports = router;

const router = require("express").Router();
const auth = require("../auth");
const Joi = require("joi");

router.get("/", async (req, res) => {
  res.send({ message: "get controls" });
});

router.post("/make", auth, async (req, res) => {
  let response = {};
  let validate = false;
  const { getServerIdFromChannelId } = require("../../models/channel");
  const { buildButtons } = require("../../models/controls");
  const { getRobotServer } = require("../../models/robotServer");

  let checkUser = await getServerIdFromChannelId(req.body.channel_id);
  console.log("CHECK USER 1: ", checkUser);
  checkUser = await getRobotServer(checkUser.result);
  console.log("CHECK USER 2: ", checkUser);

  if (checkUser.owner_id === req.user.id) validate = true;
  if (req.body.channel_id && req.body.buttons && validate) {
    const setControls = await buildButtons(
      req.body.buttons,
      req.body.channel_id
    );

    //Check for controls reference to update first,
    //If none exists, then build buttons.

    console.log("Setting controls from API: ", setControls);
    response.status = "success";
    response.result = setControls;
  } else {
    response.status = "error!";
    response.error = "could not generate controls from input";
  }
  res.send(response);
});

module.exports = router;

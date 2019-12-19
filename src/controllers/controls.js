const { logger, jsonError } = require("../modules/logging");
const log = message => {
  logger({
    level: "debug",
    source: "controllers/controls.js",
    message: message
  });
};

//default example for controls
module.exports.exampleControls = () => {
  return [
    { break: "line", label: "movement", id: "1" },
    { label: "forward", hot_key: "w", command: "f", id: "2" },
    { label: "back", hot_key: "s", command: "b", id: "3" },
    { label: "left", hot_key: "a", command: "l", id: "4" },
    { label: "right", hot_key: "d", command: "r", id: "5" },
    { break: "line", label: "", id: "6" },
    {
      label: "example admin command",
      command: "example",
      access: "owner",
      id: "7"
    }
  ];
};

module.exports.getButtonInputForChannel = async channel_id => {
  const { getChannel } = require("../models/channel");
  const { getControlsFromId } = require("../models/controls");

  const channel = await getChannel(channel_id);
  const controls = await getControlsFromId(channel.controls);
  if (controls.buttons) return controls.buttons; //only send valid key / value pairs
  return this.exampleControls;
};

module.exports.getButtonInputForUser = async (user, channel_id) => {
  return await this.getControlsFromId(channel_id, user);
};

//input: { label: "<string>", hot_key: "<string>", command: "<string>"}
//output: array of button objects w/ id generated per button
module.exports.buildButtons = async (buttons, channel_id, controls_id) => {
  const { updateControls } = require("../models/controls");
  const { validateButtonsJSON, validateButton } = require("./validate");
  const { makeId } = require("../modules/utilities");
  let response = {};
  let newButtons = [];
  let buildControls = {};
  buildControls.channel_id = channel_id;
  buildControls.id = controls_id;
  let foundError = false;
  let errorData = {};
  //generate json

  try {
    if (buttons) {
      const checkButtonsArray = validateButtonsJSON(buttons);
      if (checkButtonsArray.error) return checkButtonsArray;
      buttons.forEach(button => {
        let newButton = {};
        newButton.id = `bttn-${makeId()}`;

        //only save valid key / value pairs

        //required:
        if (!foundError && (button.label || button.label === "")) {
          newButton.label = validateButton({
            input: button.label,
            label: "Button Label",
            notRequired: true
          });
          if (newButton.label.error) {
            foundError = true;
            errorData = newButton.label;
            return errorData;
          }
        } else {
          //Dont publish invalid button
          return;
        }

        if (button.break) {
          newButton.break = button.break;
          newButtons.push(newButton);
          return;
        }

        if (!foundError && button.command) {
          newButton.command = validateButton({
            input: button.command,
            label: "Button Command"
          });
          if (newButton.command.error) {
            foundError = true;
            errorData = newButton.command.error;
            return errorData;
          }
        } else {
          //Dont publish invalid button
          return;
        }

        //optional
        if (!foundError && button.hot_key) {
          newButton.hot_key = validateButton({
            input: button.hot_key,
            label: "hot-key",
            max: 12
          });
          if (newButton.hot_key.error) {
            foundError = true;
            errorData = newButton.hot_key;
            return errorData;
          }
        }
        if (!foundError && button.access) {
          newButton.access = validateButton({
            input: button.access,
            label: "Access Level"
          });
          if (newButton.access.error) {
            foundError = true;
            errorData = newButton.access;
            return errorData;
          }
        }

        newButtons.push(newButton);
      });
    } else {
      return jsonError("invalid data to generate buttons");
    }
  } catch (err) {
    return jsonError("Problem generating buttons from input data");
  }

  if (foundError && errorData) return errorData;

  buildControls.buttons = newButtons;
  generateControls = await updateControls(buildControls);
  if (generateControls) {
    response.status = "success";
    response.result = generateControls;
    return response;
  }
  response.status = "error";
  response.error = "problem build buttons (controls.js/buildButtons)";
  return response;
};

module.exports.getControlsFromId = async (channel_id, user) => {
  const { getServerIdFromChannelId } = require("../models/channel");
  const { getRobotServer } = require("../models/robotServer");
  const { getChannel } = require("../models/channel");
  const { getControlsFromId } = require("../models/controls");

  log(`Get Controls from ID: ${channel_id}, ${user.username}`);
  let controls = await getChannel(channel_id);
  controls = await getControlsFromId(controls.controls);

  let sendButtons = [];
  if (controls && controls.buttons) {
    const { buttons } = controls;
    const getServerId = await getServerIdFromChannelId(channel_id);
    const getServer = await getRobotServer(getServerId.result);
    const testy = async button => {
      if (user && button.access && button.access === "owner") {
        //A VERY TEMPORARY SOLUTION!!!!

        if (getServer.owner_id === user.id) {
          return button;
        }
      } else if (!button.access) return button;
    };

    sendButtons = await Promise.all(buttons.map(button => testy(button)));
    sendButtons = sendButtons.filter(button => button != undefined);
    //await Promise.all(testy);
  }
  if (controls.buttons && sendButtons) {
    controls.buttons = sendButtons;
  } else {
    logger({
      level: "error",
      source: "controllers/controls.js",
      message: "Unable to Fetch Controls"
    });
  }
  return controls;
};

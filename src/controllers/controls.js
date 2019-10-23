//default example for controls
const example = [
  { label: "stop", command: "stop", access: "owner" },
  { label: "forward", hot_key: "w", command: "f" },
  { label: "back", hot_key: "s", command: "b" },
  { label: "left", hot_key: "a", command: "l" },
  { label: "right", hot_key: "d", command: "r" }
];

module.exports.getButtonInput = async controls_id => {
  const { getControlsFromId } = require("../models/controls");
  const controls = await getControlsFromId(controls_id);
  if (controls.button_input) return controls.button_input;
  return example;
};

module.exports.getButtonInputForChannel = async channel_id => {
  const { getControlsForChannel } = require("../models/controls");
  const controls = await getControlsForChannel(channel_id);
  if (controls.buttons) return controls.buttons; //only send valid key / value pairs
  return example;
};

//input: { label: "<string>", hot_key: "<string>", command: "<string>"}
//output: array of button objects w/ id generated per button
module.exports.buildButtons = async (buttons, channel_id, controls_id) => {
  const { updateControls } = require("../models/controls");
  const { makeId } = require("../modules/utilities");
  let response = {};
  let newButtons = [];
  let buildControls = {};
  buildControls.channel_id = channel_id;
  buildControls.id = controls_id;

  // console.log("BUILD BUTTONS /////////// ", buttons);

  try {
    if (buttons) {
      buttons.forEach(button => {
        let newButton = {};
        newButton.id = `bttn-${makeId()}`;

        //only save valid key / value pairs

        //required:
        if (button.label || button.label === "") {
          newButton.label = button.label;
        } else {
          console.log("INVALID BUTTON: ", button);
          return;
        }

        if (button.break) {
          newButton.break = button.break;
          newButtons.push(newButton);
          return;
        }

        if (button.command) {
          newButton.command = button.command;
        } else {
          console.log("INVALID BUTTON: ", button);
          return;
        }

        //optional
        if (button.hot_key) newButton.hot_key = button.hot_key;
        if (button.access) newButton.access = button.access;
        newButtons.push(newButton);
      });
    } else {
      return { status: "error!", error: "invalid data to generate buttons" };
    }
  } catch (err) {
    return {
      status: "error!",
      error: "Problem generating buttons from input data"
    };
  }

  // console.log("CHECK NEW BUTTONS: ", newButtons);

  buildControls.buttons = newButtons;
  generateControls = await updateControls(buildControls);
  if (generateControls) {
    response.status = "success";
    console.log("GENERATED CONTROLS: ", generateControls);
    response.result = generateControls;
    return response;
  }
  response.status = "error";
  response.error = "problem build buttons (controls.js/buildButtons)";
  return response;
};

module.exports.getControlsFromId = async (channel_id, user) => {
  const { getControlsForChannel } = require("../models/controls");
  const { getServerIdFromChannelId } = require("../models/channel");
  const { getRobotServer } = require("../models/robotServer");
  let controls = await getControlsForChannel(channel_id);
  console.log("GETTING CONTROLS FOR CHANNEL: ", controls);

  let sendButtons = [];
  const getServerId = await getServerIdFromChannelId(channel_id); //might want to move these out of map
  const getServer = await getRobotServer(getServerId.result);

  if (controls && controls.buttons) {
    const { buttons } = controls;
    const testy = async button => {
      if (button.access && button.access === "owner") {
        //A VERY TEMPORARY SOLUTION!!!!
        if (getServer.owner_id === user.id) {
          return button;
        }
      } else if (!button.access) return button;
    };

    sendButtons = await Promise.all(buttons.map(button => testy(button)));
    sendButtons = sendButtons.filter(button => button != undefined);
  }

  if (controls.buttons && sendButtons) {
    controls.buttons = sendButtons;
  } else {
    console.log("ERROR getting controls from ID");
  }
  return controls;
};

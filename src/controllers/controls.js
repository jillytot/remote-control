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
  //generate json

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
          //Dont publish invalid button
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
          //Dont publish invalid button
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
  const { getControlsForChannel } = require("../models/controls");
  const { getServerIdFromChannelId } = require("../models/channel");
  const { getRobotServer } = require("../models/robotServer");
  let controls = await getControlsForChannel(channel_id);

  let sendButtons = [];
  if (controls && controls.buttons) {
    const { buttons } = controls;
    const testy = async button => {
      if (button.access && button.access === "owner") {
        //A VERY TEMPORARY SOLUTION!!!!
        const getServerId = await getServerIdFromChannelId(channel_id); //might want to move these out of map
        const getServer = await getRobotServer(getServerId.result);
        if (getServer.owner_id === user.id) {
          console.log(
            "!\n!\nSEND ADMIN COMMAND///////////////////////: ",
            user.username,
            button.label
          );
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
    // console.log("\n?\n!\n?\n!");
  }
  return controls;
};

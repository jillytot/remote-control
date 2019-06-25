/*
import SendChat from '../components/layout/chat/sendChat';
Controls are assigned to a channel, and not tied to a specific robot
Multiple channels on a robot_server can load the same control set & feed it to different robots
Right now this only covers buttons, will will eventually include other types of input
*/
const { makeId, createTimeStamp } = require("../modules/utilities");

//TEMPORARY VALUES JUST TO ENSURE VALIDATION:
testControls = [
  { label: "forward", hot_key: "w", id: "1" },
  { label: "back", hot_key: "s", id: "2" },
  { label: "left", hot_key: "a", id: "4" },
  { label: "right", hot_key: "d", id: "3" }
];

const defaultStatus = () => {
  return {
    placeholder: "test"
  };
};
const defaultSettings = () => {
  return {
    enabled: true
  };
};

module.exports.createControls = async controls => {
  let makeInterface = {};
  makeInterface.id = `cont-${makeId()}`;
  makeInterface.created = createTimeStamp();
  makeInterface.channel_id = controls.channel_id || "dev";
  makeInterface.buttons = controls.buttons || testControls;
  makeInterface.settings = controls.settings || defaultSettings();
  makeInterface.status = controls.status || defaultStatus();

  //save controls
  console.log("SAVING CONTROLS: ", makeInterface);
  const save = await this.saveControls(makeInterface);
  console.log(save);
  if (save) {
    console.log("CONTROL INTERFACE CREATED: ", makeInterface);
    return makeInterface;
  }
  return null;
};

module.exports.saveControls = async controls => {
  console.log("SAVING CONTROLS TO DB: ", controls);
  const db = require("../services/db");
  const { id, channel_id, created, buttons, settings, status } = controls;
  const dbPut = `INSERT INTO controls (id, channel_id, created, buttons, settings, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
  try {
    const save = await db.query(dbPut, [
      id,
      channel_id,
      created,
      buttons,
      settings,
      status
    ]);
    console.log(save.rows);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
  return null;
};

//TODO: This should be getting controls.id and not using channel_id..
module.exports.getControls = async id => {
  if (!id) return null;
  console.log("Get controls from controls ID: ", id);
  const db = require("../services/db");
  const query = `SELECT * FROM controls WHERE id = $1 LIMIT 1`;
  try {
    const result = await db.query(query, [id]);
    console.log(result.rows[0]);
    if (result.rows[0]) return result.rows[0];
    console.log("Error, could not fetch data for CONTROLS");
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
  return null;
};

//TODO: Check against user & user roles
//is user timed out?
//Does user have privelage to use this command?
module.exports.validateInput = async input => {
  console.log("VALIDATE INPUT: ", input);
  let response = {};
  let validate = false;
  const checkInput = await this.getControls(input.controls_id);
  if (checkInput && checkInput.buttons) {
    checkInput.buttons.map(button => {
      if (button.label === input.button.label) validate = true;
    });
  } else {
    console.log(
      "No buttons found, validating against default controls instead"
    );
    testControls.map(button => {
      if (button.label === input.button.label) validate = true;
    });
  }

  if (validate) response.validated = true;
  if (!validate) response.validated = false;
  console.log("Validation Result: ", response.validated);
  return response;
};

//input: { label: "<string>", hot_key: "<string>", command: "<string>"}
//output: array of button objects w/ id generated per button
module.exports.buildButtons = async (buttons, channel_id) => {
  const { setControls } = require("./channel");
  let response = {};
  let newButtons = [];
  let buildControls = { channel_id: channel_id };
  //generate json
  if (buttons) {
    buttons.map(button => {
      button.id = `bttn-${makeId()}`;
      newButtons.push(button);
    });
    console.log("Buttons Generated: ", newButtons);
  } else {
    return { status: "error!", error: "invalid data to generate buttons" };
  }
  buildControls.buttons = newButtons;
  generateControls = await this.createControls(buildControls);
  let set = await setControls(generateControls, {
    channel_id: channel_id
  });
  console.log("SET CHECK: ", set);
  if (set) {
    response.status = "success";
    response.result = set;
    return response;
  }
  response.status = "error";
  response.error = "problem build buttons (controls.js/buildButtons)";
  return response;
};

module.exports.sendUpdatedControls = async (controls_id, channel_id) => {
  //send current controls for current channel to the client
  //channel stores an ID reference for it's current controls
  const channel = require("./channel");
  let sendData = {};
  sendData.channel_id = channel_id;
  sendData.controls = await this.getControls(controls_id);
  console.log("SEND UPDATED CONTROLS: ", sendData);
  channel.emitEvent(channel_id, "CONTROLS_UPDATED", sendData);
};

temp = [
  { label: "forward", hot_key: "w", command: "f" },
  { label: "back", hot_key: "s", command: "b" },
  { label: "left", hot_key: "a", command: "l" },
  { label: "right", hot_key: "d", command: "r" }
];

//TESTS:
// this.createControls({ channel_id: "test-2" });
//this.getControls("cont-8d4c5c3f-df95-4345-beed-9899076fd774");

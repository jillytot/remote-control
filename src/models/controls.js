/*
A robot interface can incorporate a number of elements: 
Displays, Control Sets, Control Types, chat room etc... 
This is all bundled into an interface that is setup on a robotServer channel
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
    // this.sendControlsToChannel(channel_id);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
  return null;
};

//replacing soonish
module.exports.getControls = async id => {
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
  const checkInput = await this.getControls(input.id);
  checkInput.map(button => {
    if (button.label === input.label) validate = true;
  });
  if (validate) response.validated = true;
  if (!validate) response.validated = false;
  console.log("Validation Result: ", response.validated);
  return response;
};

module.exports.tempCommandValidation = button => {
  console.log("VALIDATE COMMAND: ", button);
  let validate = false;
  testControls.map(control => {
    if (button.label === control.label) validate = true;
  });
  if (validate) {
    console.log("BUTTON VALIDATION PASSED");
  } else {
    console.log("BUTTON VALIDATION FAILED");
  }
  return validate;
};

//TESTS:
this.createControls({ channel_id: "test-2" });
//this.getControls("cont-8d4c5c3f-df95-4345-beed-9899076fd774");

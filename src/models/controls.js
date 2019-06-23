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

const interfacePt = {
  id: "",
  host_server: "", //host server ID
  command_pallet: [], //Buttons, analog sticks, ect...
  overlay: {}, //Specifically reserved for input relative to video feeds
  created: ""
};

module.exports.createControls = async controls => {
  let makeInterface = {};
  makeInterface.id = `cont-${makeId()}`;
  makeInterface.created = createTimeStamp();
  makeInterface.host_channel = controls.host_channel || "dev";
  makeInterface.buttons = [];

  testControls.forEach(button => {
    makeInterface.buttons.push(button);
  });

  //save controls
  console.log("SAVING CONTROLS: ", makeInterface);
  const saveControls = await this.saveControls(makeInterface);
  console.log(saveControls);
  if (saveControls) {
    console.log("CONTROL INTERFACE CREATED: ", makeInterface);
    return makeInterface;
  }
  return null;
};

saveControls = async controls => {
  const db = require("../services/db");
  const { id, host_channel, created, buttons } = controls;
  const dbPut = `INSERT INTO controls (id, host_channel, created, buttons) VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    await db.query(dbPut, [id, host_channel, created, buttons]);
    // this.sendControlsToChannel(channel_id);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.getControls = channel => {
  return {
    id: `cont-dev`,
    host_channel: "dev", //host server ID
    buttons: testControls //Buttons, analog sticks, ect...
  };
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

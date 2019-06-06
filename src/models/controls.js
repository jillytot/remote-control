/*
A robot interface can incorporate a number of elements: 
Displays, Control Sets, Control Types, chat room etc... 
This is all bundled into an interface that is setup on a robotServer channel
*/
const { makeId, createTimeStamp } = require("../modules/utilities");

//TEMPORARY VALUES JUST TO ENSURE VALIDATION:
const testControls = [
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

module.exports.createControls = controls => {
  controls.id = `cont-${makeId()}`;
  controls.created = createTimeStamp();
  console.log("CREATE ROBOT CONTROL INTERFACE: ", controls);
};

module.exports.getControls = channel => {
  return {
    id: `cont-dev`,
    host_server: "dev", //host server ID
    command_pallet: testControls, //Buttons, analog sticks, ect...
    overlay: {}, //Specifically reserved for input relative to video feeds
    created: 0
  };
};

/* 
A user can create a robot, 
this robot can be added to a robot_server
A robot needs to make a secure connection to the server to recieve input
Input is managed through a robotInterface
*/

const jwt = require("jsonwebtoken");
const db = require("../services/db");
const { makeId, createTimeStamp } = require("../modules/utilities");

robotPt = {
  name: "",
  id: "",
  owner: "",
  host_server: "",
  interfaces: [],
  auth: "",
  created: "",
  keys: []
};
module.exports.createRobot = async robot => {
  robot.id = `rbot-${makeId()}`;
  robot.created = createTimeStamp();

  console.log("CREATE ROBOT: ", robot);
};

/* 
A user can create a robot, 
this robot can be added to a robot_server
A robot needs to make a secure connection to the server to recieve input
Input is managed through a robotInterface
*/

const jwt = require("jsonwebtoken");
const db = require("../services/db");
const { makeId, createTimeStamp } = require("../modules/utilities");

const robotPt = {
  name: "",
  id: "",
  owner_id: "",
  host_server: "",
  interfaces: [],
  created: "",
  session: ""
};

module.exports.createRobot = async robot => {
  const { validateUser, getIdFromUsername } = require("./user");

  //Validate Owner
  const validate = await validateUser(robot);
  if (!validate) {
    return { status: "Error, this user does not exist" };
  }

  let makeRobot = {};
  makeRobot.id = `rbot-${makeId()}`;
  makeRobot.created = createTimeStamp();
  makeRobot.name = robot.robot_name;
  makeRobot.owner_id = await getIdFromUsername(robot.username);
  makeRobot.interfaces = [];
  makeRobot.session = "";
  makeRobot.settings = {};
  makeRobot.status = {};

  const storeRobot = await saveRobot(makeRobot);
  if (!storeRobot) return { status: "Error saving robot to server" };
  console.log("GENERATING NEW ROBOT: ", robot);
  return makeRobot;
};

saveRobot = async robot => {
  const {
    id,
    created,
    name,
    owner_id,
    interfaces,
    session,
    settings,
    status
  } = robot;
  const dbPut = `INSERT INTO robots (id, created, name, owner_id, interfaces, session, settings, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
  try {
    await db.query(dbPut, [
      id,
      created,
      name,
      owner_id,
      interfaces,
      session,
      settings,
      status
    ]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

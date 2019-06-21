/* 
A user can create a robot, 
this robot can be added to a robot_server
A robot needs to make a secure connection to the server to recieve input
Input is managed through a robotInterface
*/

const jwt = require("jsonwebtoken");

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
  const { validateUser } = require("./user");

  //Validate Owner
  // const validate = await validateUser(robot.owner);
  // if (!validate) {
  //   return { status: "Error, this user does not exist" };
  // }

  let makeRobot = {};
  makeRobot.id = `rbot-${makeId()}`;
  makeRobot.created = createTimeStamp();
  makeRobot.name = robot.robot_name;
  makeRobot.owner_id = await robot.owner.id;
  makeRobot.interfaces = [];
  makeRobot.session = "";
  makeRobot.settings = {};
  makeRobot.status = {};
  makeRobot.host_id = robot.host_id;

  const storeRobot = await saveRobot(makeRobot);
  if (!storeRobot) return { status: "Error saving robot to server" };
  console.log("GENERATING NEW ROBOT: ", robot);
  return makeRobot;
};

saveRobot = async robot => {
  const db = require("../services/db");
  const {
    id,
    created,
    name,
    owner_id,
    interfaces,
    session,
    settings,
    status,
    host_id
  } = robot;
  const dbPut = `INSERT INTO robots (id, created, name, owner_id, interfaces, session, settings, status, host_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
  try {
    await db.query(dbPut, [
      id,
      created,
      name,
      owner_id,
      interfaces,
      session,
      settings,
      status,
      host_id
    ]);
    this.sendRobotsForServer(host_id);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports.getRobotFromId = async robot_id => {
  const db = require("../services/db");
  console.log("ROBOT ID CHECK: ", robot_id);
  if (robot_id) {
    try {
      const query = `SELECT * FROM robots WHERE id = $1 LIMIT 1`;
      const check = await db.query(query, [robot_id]);
      console.log(check.rows[0]);
      if (check.rows[0]) return check.rows[0];
      return { status: "error", error: "invalid robot ID" };
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports.getRobotsFromServerId = async server_id => {
  const db = require("../services/db");
  console.log("SERVER ID CHECK: ", server_id);
  if (server_id) {
    try {
      const query = `SELECT * FROM robots WHERE host_id = $1`;
      const check = await db.query(query, [server_id]);
      console.log(check.rows);
      if (check.rows[0]) return check.rows;
      return {
        status: "error",
        error: "invalid unable to find robots listed for this server"
      };
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports.sendRobotsForServer = async server_id => {
  const robotServer = require("../models/robotServer");
  console.log("SEND ROBOTS TO SERVER CHECK: ", server_id);
  const { GET_ROBOTS } = require("../events/definitions");
  robotServer.emitEvent(
    server_id,
    GET_ROBOTS,
    await this.getRobotsFromServerId(server_id)
  );
};

module.exports.deleteRobot = async robot => {
  const { id, host_id } = robot;
  const db = require("../services/db");
  const remove = `DELETE FROM robots WHERE id =$1`;
  let response = {};
  try {
    // const checkRobotCount = await this.getRobotsFromServerId(host_id);
    // if (checkRobotCount && checkRobotCount.length <= 1) {
    //   response.status = "Error!";
    //   response.error =
    //     "You cannot delete your last remaining channel, please create another if you wish to delete this one";
    //   console.log(response);
    //   return response;
    // }
    const result = await db.query(remove, [id]);
    response.status = "success!";
    response.result = "Robot successfullly deleted";
    console.log(response);

    await this.sendRobotsForServer(host_id);
    return response;
  } catch (err) {
    response.error = err;
    response.status = "error!";
    console.log(response);
    return response;
  }
};

this.deleteRobot({
  id: "rbot-1d4a0319-151b-4265-b331-1b00a09b3023",
  host_id: "serv-7e2c6372-b985-401f-8f51-991ea6cd7456"
});

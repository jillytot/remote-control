const jwt = require("jsonwebtoken");
const db = require("../services/db");
const {
  makeId,
  hash,
  checkHash,
  createTimeStamp,
  createTimer
} = require("../modules/utilities");
const config = require("../config/serverSettings");
const tempSecret = config.secret;

const {
  ACTIVE_USERS_UPDATED
} = require("../services/sockets/events").socketEvents;

//User status Prototype:
const statusPt = {
  //server_id: global refers to global status
  timeout: false
  //types: [] //Global Only
};
//server_id: Status, individual server status per user will mirror the global status as much as possible

const settingsPt = {
  test_value: null
}; //Global Settings
//server_id: {} ...Settings for individual servers will be listed here, scheme will mirror global as much as possible
//roles will be a more robust way to manage user types
const rolesPt = [{ server_id: "global", roles: [] }];

module.exports.createUser = async user => {
  //ALWAYS SAVE EMAIL AS LOWERCASE!!!!!
  const email = user.email.toLowerCase();
  console.log("check email to lowercase ", email);

  //Does this username or email exist?
  let checkUser = user.username.toLowerCase();
  let result = await this.checkUsername(checkUser);
  console.log("CHECK USER RESULT: ", result);
  let emailResult = await this.checkEmail(user);
  console.log("CHECK EMAIL RESULT: ", emailResult);
  if (result === true) {
    console.log("ERROR, USERNAME ALREADY EXISTS, please try a different one");
    return {
      username_status:
        "This username already exists, please try a different one"
    };
  }

  if (emailResult === true) {
    console.log("ERROR, EMAIL IS ALREADY IN USE, please try a different one");
    return {
      email_status: "This email is already in use, unique email is required"
    };
  }

  //Generate UUID, PW Hash
  user.id = `user-${makeId()}`;
  user.password = await hash(user.password);
  user.created = createTimeStamp();
  user.type = []; //Change to "Roles" at some point.
  user.check_username = checkUser; //save a copy of username all lowercase
  user.status = statusPt;
  user.settings = settingsPt;
  user.session = "";
  console.log(
    `${user.username} also saved as ${user.check_username}, status set: ${
      user.status
    } intialized settings: ${user.settings}`
  );

  console.log("Generating User: ", user);

  const {
    username,
    id,
    password,
    created,
    check_username,
    status,
    settings,
    session
  } = user;
  const dbPut = `INSERT INTO users (username, id, password, email, created, check_username, status, settings, session) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
  try {
    await db.query(dbPut, [
      username,
      id,
      password,
      email,
      created,
      check_username,
      status,
      settings,
      session
    ]);

    const token = await this.createAuthToken(user);

    return { status: "Account successfully created", token: token };
  } catch (err) {
    console.log(err.stack);
  }
  console.log("New User Generated: ", this.publicUser(user));
};

//Is this an actual user that currently exists?
module.exports.validateUser = async input => {
  console.log("Get User: ", input);
  if (input && input.username) {
    console.log("Get user based on username");
    const check = await this.checkUsername(input.username);
    console.log("VALIDATE ? ", check);
    return check;
  } //get based on username
  if (input && input.id) {
    console.log("Get user based on userId");
    const check = await this.checkUserId(input.id);
    console.log("VALIDATE ? ", check);
    return check;
  } //get based on userId
  console.log("VALIDATION ERROR");
  return null;
};

module.exports.checkUserId = async user => {
  const { id } = user;
  const query = `SELECT COUNT(*) FROM users WHERE id = $1 LIMIT 1`;
  const check = await db.query(query, [id]);
  if (check.rows[0].count > 0) {
    return false;
  } else {
    return true;
  }
};

module.exports.getIdFromUsername = async username => {
  if (username) {
    const query = `SELECT * FROM users WHERE username = $1 LIMIT 1;`;
    const check = await db.query(query, [username]);
    return check.rows[0].id;
  }
  return null;
};

module.exports.getUserInfoFromId = async userId => {
  if (userId) {
    console.log("Get username from Id: ", userId);
    const query = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
    const check = await db.query(query, [userId]);
    const getInfo = this.publicUser(check.rows[0]);
    //console.log(getInfo);
    return getInfo;
  }
  return null;
};

/* note from Gedd: 
CREATE UNIQUE INDEX username_idx ON users (username);
Gedyy: would prevent i dont know time attacks if thats what you can call them
Gedyy: 2 requests happening at the same time so they both check past the username exists check adding the user twice
Gedyy: in pgadmin query tool
*/

//Check for duplicate usernames
module.exports.checkUsername = async user => {
  let check_username = "";
  if (user && user.username) {
    check_username = user.username.toLowerCase();
  } else {
    check_username = user;
  }
  if (check_username === "") return false;
  console.log("CHECK USERNAME", check_username);
  const checkName = `SELECT COUNT(*) FROM users WHERE check_username = $1 LIMIT 1`;
  const checkRes = await db.query(checkName, [check_username]);
  console.log(checkRes.rows[0]);
  if (checkRes.rows[0].count > 0) {
    return true;
  } else {
    return false;
  }
};

//Check for duplicate emails
module.exports.checkEmail = async user => {
  const { email } = user;
  const checkName = `SELECT COUNT(*) FROM users WHERE email = $1 LIMIT 1`;
  const checkRes = await db.query(checkName, [email]);
  //console.log(checkRes.rows[0].count);
  if (checkRes.rows[0].count > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports.checkPassword = async user => {
  console.log("Password Check: ", user.username);

  try {
    const { password, username } = user;

    //DB Call
    const query = `SELECT * FROM users WHERE username = $1 LIMIT 1`;
    const queryResult = await db.query(query, [username]);
    console.log("Query Result: ", queryResult.rows[0]["id"]);
    let checkPassword = await checkHash(
      password,
      queryResult.rows[0]["password"]
    );
    let verify = {
      password: checkPassword,
      token: await this.createAuthToken(queryResult.rows[0]),
      username: username
    };
    return verify;
  } catch (err) {
    console.log("Password Error: ", err);
  }
};

module.exports.createAuthToken = user => {
  console.log("Create Auth Token: ", user);
  const { id } = user;
  return jwt.sign({ id: id }, tempSecret, {
    subject: "",
    expiresIn: "30d",
    algorithm: "HS256"
  });
};

//TOKEN MANAGEMENT
module.exports.authUser = async token => {
  let auth = await this.extractToken(token);
  console.log("Extracted Token: ", auth);
  auth = await this.verifyAuthToken(auth);
  return auth;
};

module.exports.extractToken = async token => {
  console.log("Verifying Auth Token");
  let checkToken = null;
  try {
    return (checkToken = await new Promise((resolve, reject) => {
      jwt.verify(token, tempSecret, "HS256", (err, res) => {
        console.log("JWT Verify: ", token);
        if (err) return reject(err);
        return resolve(res);
      });
    }));
  } catch (err) {
    let reason = {
      error: "problem creating token from user"
    };
    Promise.reject(reason);
    console.log(reason);
    return null;
  }
};

module.exports.verifyAuthToken = async token => {
  console.log("Check Token: ", token);
  if (token && token.id) {
    const query = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [token["id"]]);
    console.log("Get user from DB: ", result.rows[0]);
    return await result.rows[0];
  } else {
    let reason = {
      error: "cannot resolve user data from token"
    };
    console.log(reason);
    Promise.reject(reason);
    return null;
  }
};

//Get public info about a user from the DB
module.exports.getPublicUserInfo = async userId => {
  let userInfo = {};
  try {
    const query = `SELECT username, id, created FROM users WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [userId]);
    userInfo = result.rows[0];
    console.log(userInfo);
  } catch (err) {
    console.log(err);
  }
  return userInfo;
};

module.exports.publicUser = user => {
  if (user)
    return {
      username: user.username,
      id: user.id,
      created: user.created,
      type: user.type,
      status: user.status
      // settings: user.settings
    };
};

module.exports.sendActiveUsers = async robot_server => {
  const { io } = require("../services/server/server");
  let users = [];
  return await new Promise((resolve, reject) => {
    io.of("/")
      .in(robot_server)
      .clients((error, clients) => {
        if (error) {
          return reject(error);
        }
        clients.map(client => {
          let activeUser = this.publicUser(io.sockets.connected[client].user);
          if (activeUser) {
            users.push(activeUser);
          } else {
            console.log("Could not get active user from socket ID");
          }
        });
        io.to(robot_server).emit(ACTIVE_USERS_UPDATED, users);
        console.log("Send Active Users:", users);
        return resolve(users);
      });
  });
};

//USER TYPE MANAGEMENT
/*
  Badges: There are 4 slots for badges, even though a user can be multiple overlapping types
  Slot 1: Global (example: Staff, Global MOderator), 
  Slot 2: Local (example: owner, moderator), 
  Slot 3: Global Support (AKA Patreon), 
  Slot 4: Local Support (AKA Server Sub) 
  */

module.exports.userTypes = [
  "staff",
  "owner",
  "robot",
  "global_moderator",
  "local_moderator"
];

module.exports.addUserTypes = async (userId, types) => {
  console.log(`adding types: ${types} to ${userId}`);
  try {
    const insert = `UPDATE users SET type = $1 WHERE id = $2 RETURNING *`;
    const result = await db.query(insert, [types, userId]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

//UDPATE USER STATUS
module.exports.updateStatus = async user => {
  const { status } = user;
  console.log(`Updating global status for ${user.username}`);
  try {
    const insert = `UPDATE users SET status = $1 WHERE id = $2 RETURNING *`;
    const result = await db.query(insert, [status, user.id]);
    const print = result.rows[0];
    console.log("User Status Updated: ", print);
    this.sendUpdateStatus(this.publicUser(print));
    return print;
  } catch (err) {
    console.log(err);
  }
};

//MANAGE TIMEOUTS
module.exports.timeoutUser = async (user, time, server_id) => {
  console.log("TIMEOUT USER: ", user, time);
  if (user && time) {
    let { status } = user;
    status.timeout = true;
    user.status = status;
    let checkUpdatedStatus = await this.updateStatus(user);
    createTimer(time, this.unTimeoutUser, user);
    return checkUpdatedStatus;
  }
  console.log("Timout Error");
  return null;
};

module.exports.unTimeoutUser = async user => {
  console.log("END TIMEOUT FOR USER: ", user);
  if (user) {
    let { status } = user;
    status.timeout = false;
    user.status = status;
    await this.updateStatus(user);
    return true;
  }
  console.log("Timout Error");
  return null;
};

const timeoutObject = {
  moderator: null,
  user: null,
  duration: null,
  timestamp: createTimeStamp(),
  server: null,
  chatRoom: null,
  reason: null
};

//Update client when their status has changed
module.exports.sendUpdateStatus = user => {
  const { io } = require("../services/server/server");
  const {
    USER_STATUS_UPDATED
  } = require("../services/sockets/events").socketEvents;
  io.to(user.id).emit(USER_STATUS_UPDATED, user.status);
};

/*
When is timed out, an event needs to be sent to the timed out user, 
In a global timeout, an event must be sent to chat clients the user is currently subscribed to
There needs to be a log of who timed them out and for how long 
Chat and Controls need to be disabled for timedout user for the duration of a global timeout
*/

//Check if a user has particular, "types", return true or false to validate chat commands
module.exports.checkTypes = async (user, typesToCheck) => {
  let validate = false;
  let checkUser = await this.getUserInfoFromId(user.id);
  if (checkUser && checkUser.type) {
    console.log("CHECKING USER TYPES: ", checkUser, typesToCheck);
    const check = checkUser.type.map(type => {
      return typesToCheck.includes(type);
    });
    if (check.includes(true) || check === true) validate = true;
  }
  return validate;
};

module.exports.getGlobalTypes = async user_id => {
  const sendTypes = await this.getUserInfoFromId(user_id);
  console.log(sendTypes);
  return sendTypes.type;
};

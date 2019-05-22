const jwt = require("jsonwebtoken");
const db = require("../services/db");
const {
  makeId,
  hash,
  checkHash,
  createTimeStamp
} = require("../modules/utilities");
const tempSecret = "temp_secret";

const {
  ACTIVE_USERS_UPDATED
} = require("../services/sockets/events").socketEvents;

module.exports.createUser = async user => {
  //ALWAYS SAVE EMAIL AS LOWERCASE!!!!!
  const email = user.email.toLowerCase();
  console.log("check email to lowercase ", email);

  //Does this username or email exist?
  let result = await this.checkUsername(user);
  let emailResult = await this.checkEmail(user);
  if (result === false)
    return {
      username_status:
        "This username already exists, please try a different one"
    };
  if (emailResult === false)
    return {
      email_status: "This email is already in use, unique email is required"
    };

  //Generate UUID, PW Hash
  user.id = `user-${makeId()}`;
  user.password = await hash(user.password);
  user.created = createTimeStamp();
  user.type = [];

  console.log("Generating User: ", user);

  const { username, id, password, created } = user;
  const dbPut = `INSERT INTO test (username, id, password, email, created) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  try {
    await db.query(dbPut, [username, id, password, email, created]);
    const token = await this.createAuthToken(user);
    return { status: "Account successfully created", token: token };
  } catch (err) {
    console.log(err.stack);
  }
};

/* note from Gedd: 
CREATE UNIQUE INDEX username_idx ON test (username);
Gedyy: would prevent i dont know time attacks if thats what you can call them
Gedyy: 2 requests happening at the same time so they both check past the username exists check adding the user twice
Gedyy: in pgadmin query tool
*/

//Check for duplicate usernames
module.exports.checkUsername = async user => {
  const { username } = user;
  const checkName = `SELECT COUNT(*) FROM test WHERE username = $1 LIMIT 1`;
  const checkRes = await db.query(checkName, [username]);
  //console.log(checkRes.rows[0].count);
  if (checkRes.rows[0].count > 0) {
    return false;
  } else {
    return true;
  }
};

//Check for duplicate emails
module.exports.checkEmail = async user => {
  const { email } = user;
  const checkName = `SELECT COUNT(*) FROM test WHERE email = $1 LIMIT 1`;
  const checkRes = await db.query(checkName, [email]);
  //console.log(checkRes.rows[0].count);
  if (checkRes.rows[0].count > 0) {
    return false;
  } else {
    return true;
  }
};

module.exports.checkPassword = async user => {
  const { password, id } = user;

  //DB Call
  const query = `SELECT * FROM test WHERE id = $1 LIMIT 1`;
  const queryResult = await db.query(query, [id]);

  //Check Hash
  return await checkHash(password, queryResult.rows[0]["password"]);
};

module.exports.createAuthToken = user => {
  const { id } = user;
  return jwt.sign({ id: id }, tempSecret, {
    subject: "",
    expiresIn: "30d",
    algorithm: "HS256"
  });
};

module.exports.verifyAuthToken = async token => {
  const checkToken = await new Promise((resolve, reject) => {
    console.log(token.token);
    jwt.verify(token, tempSecret, "HS256", (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });

  //console.log("Check Token: ", checkToken);

  const query = `SELECT * FROM test WHERE id = $1 LIMIT 1`;
  const result = await db.query(query, [checkToken["id"]]);
  //console.log("Get user from DB: ", result.rows[0]);
  return await result.rows[0];
};

//Get public info about a user from the DB
module.exports.getPublicUserInfo = async userId => {
  let userInfo = {};
  try {
    const query = `SELECT username, id, created FROM test WHERE id = $1 LIMIT 1`;
    const result = await db.query(query, [userId]);
    userInfo = result.rows[0];
    console.log(userInfo);
  } catch (err) {
    console.log(err);
  }
  return userInfo;
};

module.exports.publicUser = user => {
  return {
    username: user.username,
    id: user.id,
    created: user.created,
    type: user.type
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
          users.push(activeUser);
        });
        io.to(robot_server).emit(ACTIVE_USERS_UPDATED, users);
        console.log("Send Active Users:", users);
        return resolve(users);
      });
  });
};

// module.exports.getUserType = id => {};

// const userTypesToDb = {
//   staff: "{staff}",
//   owner: "{owner}",
//   robot: "{robot}",
//   global_moderator: "{global_moderator}",
//   local_moderator: "{local_moderator}"
// };

// const userTypes = {
//   staff: "staff",
//   owner: "owner",
//   robot: "robot",
//   global_moderator: "global_moderator",
//   local_moderator: "local_moderator"
// };

// module.exports.setUserType = async (userId, type) => {
//   try {
//     const insert = `UPDATE test SET type = $1 WHERE id = $2 LIMIT 1`;
//   } catch (err) {
//     console.log(err);
//   }
// };

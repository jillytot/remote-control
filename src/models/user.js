const jwt = require("jsonwebtoken");
const db = require("../services/db");
const { makeId, hash, createTimeStamp } = require("../modules/utilities");
const tempSecret = "temp_secret";

//Store current user
let currentUser = {};
module.exports.setUser = data => {
  currentUser = data;
  console.log("Current User Set: ", data);
};

module.exports.getUser = () => {
  return currentUser;
};

module.exports.createUser = async user => {
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
  user.id = makeId();
  user.password = await hash(user.password);
  user.created = createTimeStamp();

  const { username, id, password, email, created } = user;
  const dbPut = `INSERT INTO test (username, id, password, email, created) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  try {
    const res = await db.query(dbPut, [username, id, password, email, created]);
    //console.log("db insertion result: ", res.rows[0]);
    const token = this.createAuthToken(user);
    //console.log("Verified: ", await this.verifyAuthToken(token));
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
  console.log(checkRes.rows[0].count);
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
  console.log(checkRes.rows[0].count);
  if (checkRes.rows[0].count > 0) {
    return false;
  } else {
    return true;
  }
};

module.exports.checkPassword = async user => {
  const { password, id } = user;
  console.log(password, id);
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
      if (err) reject(err);
      resolve(res);
    });
  });

  console.log("Check Token: ", checkToken);

  const query = `SELECT * FROM test WHERE id = $1 LIMIT 1`;
  const result = await db.query(query, [checkToken["id"]]);
  console.log("Get user from DB: ", result.rows[0]);
  return result.rows[0];
};

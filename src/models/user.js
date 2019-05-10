const jwt = require("jsonwebtoken");
const db = require("../services/db");

module.exports.createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

module.exports.createUser = async user => {
  console.log("Add User: ", user);
  const { username, id, password, email } = user;
  let result = await this.checkUsername(user);
  console.log("result: ", result);
  if (result === false) return { status: "you done messed up!" };
  const dbPut = `INSERT INTO test (username, id, password, email) VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    const res = await db.query(dbPut, [username, id, password, email]);
    console.log("db insertion result: ", res.rows[0]);
    return { status: "New account created!" };
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

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
  let result = await this.checkUsername(user.username);
  console.log("result: ", result);
  if (result !== false) return { status: "you done messed up!" };
  const dbPut = `INSERT INTO test (username, id, password, email) VALUES($1, $2, $3, $4) RETURNING *`;
  try {
    const res = await db.query(dbPut, [username, id, password, email]);
    console.log("db insertion result: ", res.rows[0]);
    return { status: "New account created!" };
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports.checkUsername = async user => {
  const { username } = user;
  const checkName = `SELECT exists ( SELECT 1 FROM test WHERE username = $1 )`;
  const checkRes = await db.query(checkName, [username]);
  return checkRes.rows[0]["exists"];
};

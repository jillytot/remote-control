module.exports.saveKey = async getKey => {
  const db = require("../services/db");
  const { key_id, created, expires, ref, expired } = getKey;
  const save = `INSERT INTO generated_keys (key_id, created, expires, ref, expired ) VALUES ( $1, $2, $3, $4, $5) RETURNING key_id`;
  try {
    const result = await db.query(save, [
      key_id,
      created,
      expires,
      ref,
      expired
    ]);
    if (result.rows[0]) {
      console.log("Key Saved: ", result.rows[0]);
      return result.rows[0];
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports.getKey = async key => {
  const db = require("../services/db");
  const { key_id, ref } = key;
  const query = `SELECT * FROM generated_keys WHERE ( key_id, ref ) = ( $1, $2 )`;
  try {
    const result = db.query(query, [key_id, ref]);
    if (result.rows[0]) {
      console.log("Get Key Result: ", result.rows[0]);
      return result.rows[0];
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

module.exports.updateKey = async ({ user_id, key_id, expired }) => {
  const db = require("../services/db");
  const query = `UPDATE generated_keys SET expired = ( $1 ) WHERE ( key_id ) = ( $2 ) RETURNING *`;
  try {
    const result = await db.query(query, [expired, key_id]);
    if (result.rows[0]) {
      console.log("Update Key Result: ", result.rows[0]);
      return result.rows[0];
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

const { jsonError } = require("../modules/logging");
//Leaving this all untested for now : ]

module.exports.savePatron = async ({ user_id, username, token_data }) => {
  const db = require("../services/db");
  const save = `INSERT INTO patreon (user_id, username, token_data ) VALUES ( $1, $2, $3) RETURNING *`;
  try {
    const result = await db.query(save, [user_id, username, token_data]);
    if (result.rows[0]) {
      console.log("Update Key Result: ", result.rows[0]);
      return result.rows[0];
    }
  } catch (e) {
    console.log(e);
  }
  return jsonError(
    "There was an issue with saving Patron data, please try again later"
  );
};

//Udpate Token Data
module.exports.patronUpdateToken = async ({ user_id, token_data }) => {
  const db = require("../services/db");
  const query = `UPDATE patreon SET token_data = ( $1 ) WHERE ( user_id) = ( $2 ) RETURNING *`;
  try {
    const result = await db.query(query, [token_data, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem updating Patron Data");
};

//Update Pledge Data
module.exports.patronUpdatePledgeData = async ({ user_id, pledge_data }) => {
  const db = require("../services/db");
  const query = `UPDATE patreon SET pledge_data = ( $1 ) WHERE ( user_id) = ( $2 ) RETURNING *`;
  try {
    const result = await db.query(query, [pledge_data, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem updating Patron Data");
};

//get patron data:
module.exports.getPatron = async ({ user_id }) => {
  const db = require("../services/db");
  const query = `SELECT * from patreon WHERE  ( user_id) = ( $1 )`;
  try {
    const result = await db.query(query, [user_id]);
    if (result.rows[0]) return result.rows[0];
    else return null;
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem fetching data for this user");
};

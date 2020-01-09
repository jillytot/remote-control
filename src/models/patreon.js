const { jsonError } = require("../modules/logging");
//Leaving this all untested for now : ]

module.exports.savePatron = async ({ user_id, username, patreon_id }) => {
  const db = require("../services/db");
  const save = `INSERT INTO patreon (user_id, username, patreon_id ) VALUES ( $1, $2, $3) RETURNING *`;
  try {
    const result = await db.query(save, [user_id, username, patreon_id]);
    if (result.rows[0]) {
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
module.exports.patronUpdateId = async ({ user_id, patreon_id }) => {
  const db = require("../services/db");
  const query = `UPDATE patreon SET patreon_id = ( $1 ) WHERE ( user_id ) = ( $2 ) RETURNING *`;
  try {
    const result = await db.query(query, [patreon_id, user_id]);
    if (result.rows[0]) return result.rows[0];
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem updating Patron Data");
};

//get patron data:
module.exports.getPatron = async ({ user_id }) => {
  const db = require("../services/db");
  const query = `SELECT * from patreon WHERE  ( user_id ) = ( $1 )`;
  try {
    const result = await db.query(query, [user_id]);
    if (result.rows[0]) return result.rows[0];
    else return null;
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem fetching data for this user");
};

//Returns true if this Patreon ID is found
module.exports.checkPatreonId = async patreon_id => {
  const db = require("../services/db");
  const query = `SELECT * from patreon WHERE  ( patreon_id ) = ( $1 )`;
  try {
    const result = await db.query(query, [patreon_id]);
    if (result.rows[0]) return true;
    return null;
  } catch (err) {
    console.log(err);
  }
  return jsonError("There was a problem fetching data for this user");
};

module.exports.removePatreonLink = async user_id => {
  const db = require("../services/db");
  const query = `DELETE FROM patreon WHERE ( user_id ) = ( $1 )`;
  try {
    const result = await db.query(query, [user_id]);
    if (result.rowCount > 0) return "Link successfully removed.";
  } catch (err) {
    console.log(err);
  }
  return jsonError("Unable to remove Patreon Link");
};

module.exports.updatePatronRewards = async data => {
  const { patreon_id } = data;
  const db = require("../services/db");
  const query = `UPDATE patreon SET active_rewards = ( $1 ) WHERE ( patreon_id ) = ( $2 ) RETURNING *`;
  try {
    const result = await db.query(query, [data, patreon_id]);
    if (result.rows[0]) return result.rows[0];
    return null;
  } catch (err) {
    console.log(err);
  }
  return jsonError("Could not update rewards for user");
};

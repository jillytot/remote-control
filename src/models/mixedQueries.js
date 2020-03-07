module.exports.getMemberAndUserSettings = async server_id => {
  const db = require("../services/db");
  const query = `SELECT users.settings, users.status, users.username, users.email, users.id, members.settings AS member_settings, members.status AS member_status FROM users, members WHERE users.id = members.user_id AND members.server_id = $1`;
  try {
    const result = await db.query(query, [server_id]);
    if (result.rows[0]) return result.rows;
  } catch (err) {
    console.log(err);
  }
  return null;
};

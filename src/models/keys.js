module.exports.saveKey = async getKey => {
  const db = require("../services/db");
  const { key_id, created, expires, ref, expired } = getKey;
  const save = `INSERT INTO generated_keys (key_id, created, expires, ref, expired ) VALUES ( $1, $2, $3, $4, $5) RETURNING key`;
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

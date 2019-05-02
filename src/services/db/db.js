const { Client } = require("pg");
const client = new Client({ user: "postgres", database: "remote_control" });

client.connect();
module.exports = client;

dbStore = async (table, column, values) => {
  //3rd value always needs to be an array
  const text = `INSERT INTO ${table}(${column}) VALUES($1) RETURNING *`;
  try {
    const res = await db.query(text, values);
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err.stack);
  }
};

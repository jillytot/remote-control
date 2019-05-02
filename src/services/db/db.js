const { Client } = require("pg");
const client = new Client({ user: "postgres", database: "remote_control" });

client.connect();
module.exports = client;

// const res = await client.query("SELECT $1::text as message", ["Hello world!"]);
// console.log(res.rows[0].message); // Hello world!
// await client.end();

//old DB, may depricate

const { Client } = require("pg");
const client = new Client({ user: "postgres", database: "remote_control" });

client.connect();
module.exports = client;

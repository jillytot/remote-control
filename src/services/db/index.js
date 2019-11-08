const { Pool } = require("pg");
const config = require("../../config/server");
const winston = require("winston");
//const client = new Client({ user: "postgres", database: "remote_control" });

const dbConfig = {
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis
};

const pool = new Pool(dbConfig);
pool.on("error", function(err) {
  winston.error("idle client error", err.message, err.stack);
});

module.exports = {
  pool,
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};

pool.connect();
module.exports = pool;

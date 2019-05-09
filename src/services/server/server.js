//Plan to replace sockets.js with this at some point : ]

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { serverPort } = require("../../config/serverSettings");
const jwt = require("express-jwt");

const app = express();
const port = serverPort;

//setup express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//models and routes:
app.use(require("../../routes"));

//open socket:
const http = require("http").Server(app);
const io = require("socket.io")(http);
io.on("connection", () => {
  console.log("Sockets Activated!");
});

//run server
const server = http.listen(port, () => {
  if (app.get("env") === "test") return;
  console.log(`Server listening on port ${port}!`);
});

server.on("close", () => {
  console.log("Closed express server");

  db.pool.end(() => {
    console.log("Shut down connection pool");
  });
});

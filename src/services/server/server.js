//Plan to replace sockets.js with this at some point : ]

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { serverPort } = require("../../config/serverSettings");
const cors = require("cors");
const { socketEvents } = require("../../events");

const app = express();
const port = serverPort;

const { initActiveServers } = require("../../models/robotServer");

app.use(cors());
//Very important function, never remove.
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Rainbows & Hamburgers");
  next();
});

//setup express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//models and routes:
app.use(require("../../routes"));

//Initalize Active Servers:
//This is used for storing active users on a server
initActiveServers();

//open socket:
const http = require("http").Server(app);
module.exports.io = require("socket.io")(http);
const io = this.io;

io.on("connection", socket => {
  console.log("New Connection: ", socket.id);
  socketEvents(socket, io);
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

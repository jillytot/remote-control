var app = require("http").createServer();
var io = (module.exports.io = require("socket.io")(app));
const { serverPort } = require("../../config/serverSettings");

const PORT = process.env.PORT || serverPort;
const SocketManager = require("./socketManager").default;

io.on("connection", SocketManager);

app.listen(PORT, () => {
  console.log("Connected to port:" + PORT);
});

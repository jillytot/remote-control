const WebSocket = require("ws");
const http = require("../http");
const events = require("../../events");

const wss = new WebSocket.Server({ server: http });

wss.on("connection", events.handleConnection);

module.exports = wss;

const WebSocket = require("ws");
const http = require("../http");
const events = require("../../events");

const wss = new WebSocket.Server({ server: http });

wss.on("connection", events.handleConnection);

wss.emitInternalEvent = (event, data) => {
  wss.clients.forEach(ws => {
    if (ws.internalListener){
      ws.emitEvent(event, data);
    }
  });
};

wss.emitEvent = (event, data) => {
  wss.clients.forEach(ws => {
    ws.emitEvent(event, data);
  });
};

wss.internalBannedUsernames = [];
wss.internalBannedIps = [];

module.exports = wss;

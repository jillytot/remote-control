const events = {}; //event: func

// message structure {e: event name, d: data}
module.exports.handleConnection = ws => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", message => {
    let messageData;
    try {
      messageData = JSON.parse(message);
    } catch (e) {
      return console.log("Malformed Message");
    }

    const event = messageData.e;
    const data = messageData.d;

    if (events.hasOwnProperty(event)) {
      events[event](ws, data);
    } else {
      console.log("Unknown Event: ", event);
    }
  });

  ws.emitEvent = (event, data) => {
    ws.send(JSON.stringify({ e: event, d: data }));
  };
};

const interval = setInterval(() => {
  const wss = require("../services/wss");
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

function registerEvent(event, func) {
  events[event] = func;
}

registerEvent("TEST_EVENT", require("./testEvent"));
registerEvent("AUTHENTICATE", require("./authenticate"));
registerEvent("GET_CHANNELS", require("./getChannels"));
registerEvent("GET_ROBOTS", require("./getRobots"));
registerEvent("GET_CHANNELS", require("./getChannels"));
registerEvent("GET_CHAT", require("./getChat"));
registerEvent("JOIN_CHANNEL", require("./joinChannel"));
registerEvent("MESSAGE_SENT", require("./messageSent"));
registerEvent("BUTTON_COMMAND", require("./buttonCommand"));
//have to register them all with there definitions here

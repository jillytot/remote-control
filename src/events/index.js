const events = {}; //event: func

// message structure {e: event name, d: data}
module.exports.handleConnection = ws => {
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

function registerEvent(event, func) {
  events[event] = func;
}

registerEvent("TEST_EVENT", require("./testEvent"));
//have to register them all with there definitions here

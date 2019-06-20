import EventEmmiter from "events";

function WebSocketClient() {
  this.autoReconnectInterval = 5 * 1000; // ms
  this.eventEmmiter = new EventEmmiter();
  this.on = (event, func) => {
    this.eventEmmiter.on(event, func);
  };
  this.connected = false;
}

WebSocketClient.prototype.open = function(url) {
  this.url = url;
  this.instance = new window.WebSocket(this.url);
  console.log(this.instance);
  this.instance.onopen = () => {
    this.onopen();
  };

  this.instance.onmessage = data => {
    this.onmessage(data);
  };

  this.instance.onclose = e => {
    this.connected = false;
    switch (e.code) {
      case 1000: // CLOSE_NORMAL
        console.log("WebSocket: closed");
        break;
      default:
        // Abnormal closure
        this.reconnect(e);
        break;
    }
    this.onclose(e);
  };
  this.instance.onerror = e => {
    switch (e.code) {
      case "ECONNREFUSED":
        this.reconnect(e);
        break;
      default:
        this.onerror(e);
        break;
    }
  };
};
WebSocketClient.prototype.emit = function(event, data) {
  try {
    this.instance.send(JSON.stringify({ e: event, d: data }));
  } catch (e) {
    console.error("Error Emmitting: ", e);
  }
};
WebSocketClient.prototype.reconnect = function(e) {
  this.connected = false;
  console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
  var that = this;
  setTimeout(function() {
    console.log("WebSocketClient: reconnecting...");
    that.open(that.url);
  }, this.autoReconnectInterval);
};

WebSocketClient.prototype.onopen = function(e) {
  this.connected = true;
  console.log("WebSocketClient: open");

  this.eventEmmiter.emit("connect");
};
WebSocketClient.prototype.onmessage = function(e) {
  const message = e.data;
  let messageData;
  try {
    messageData = JSON.parse(message);
  } catch (e) {
    return console.log("Malformed Message: ", message);
  }

  const event = messageData.e;
  const data = messageData.d;

  this.eventEmmiter.emit(event, data);
};
WebSocketClient.prototype.onerror = function(e) {
  console.log("WebSocketClient: error", arguments);
};
WebSocketClient.prototype.onclose = function(e) {
  console.log("WebSocketClient: closed");
  this.eventEmmiter.emit("disconnect");
};

export default WebSocketClient;

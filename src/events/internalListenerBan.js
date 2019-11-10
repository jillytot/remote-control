const wss = require("../services/wss");

module.exports = async (ws, data) => {
  if (ws.internalListener){
    if (data.ip){
      if (!wss.internalBannedIps.includes(data.ip)){
        wss.internalBannedIps.push(data.ip);
      }
    }   

    if (data.username){
      if (!wss.internalBannedUsernames.includes(data.username)){
        wss.internalBannedUsernames.push(data.username);
      }
    }

    wss.clients.forEach(ws => {
      if (wss.internalBannedIps.includes(ws.ip) || (ws.user && wss.internalBannedUsernames.includes(ws.user.username))){
        ws.emitEvent('ALERT', 'You have been banned from remo.tv');
        ws.terminate();
      }
    });
  }
}
  
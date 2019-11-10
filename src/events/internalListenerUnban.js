module.exports = async (ws, data) => {
  const wss = require("../services/wss");
   
  if (ws.internalListener){
    if (data.ip){
      if (wss.internalBannedIps.includes(data.ip)){
        wss.internalBannedIps = wss.internalBannedIps.filter(value => value !== data.ip);
      }
    }   

    if (data.username){
      if (wss.internalBannedUsernames.includes(data.username)){
        wss.internalBannedUsernames = wss.internalBannedUsernames.filter(value => value !== data.username);
      }
    }
  }
}
  
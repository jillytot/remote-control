const {internalKey} = require('../config/server')

module.exports = async (ws, data) => {
  if (internalKey && internalKey === data.key){
    console.log('Internal Listener Connected')
    ws.internalListener = true;
    ws.emitEvent('INTERNAL_LISTENER_VALIDATED')
  }
}
  
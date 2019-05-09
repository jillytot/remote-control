const AUTHENTICATE = require("./AUTHENTICATE");

handler = async (socket, event, data) => {
  if (event === "AUTHENTICATE") await AUTHENTICATE(socket, data);
};

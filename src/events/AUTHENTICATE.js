const user = require("../models/user");

module.exports = async (socket, data) => {
  if (socket.user) console.log("User already Authenticated");
  socket.user = {
    username: data.username,
    password: data.password,
    email: data.email
  };

  user.createUser(user);
  socket.send(JSON.stringify(["AUTHENTICATED"]));
  return socket;
};

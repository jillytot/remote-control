const { serverPort } = require("./serverSettings");

const host = {
  local: "http://localhost"
};

const api = {
  api: "/api",
  signup: "/signup",
  auth: "/auth",
  login: "/login"
};

module.exports = {
  socketUrl: `${host.local}:${serverPort}`,
  apiUrl: `${host.local}:${serverPort}${api.api}`,
  apiAuth: `${host.local}:${serverPort}${api.api}${api.auth}`,
  apiSignup: `${host.local}:${serverPort}${api.api}${api.signup}`,
  apiLogin: `${host.local}:${serverPort}${api.api}${api.login}`
};

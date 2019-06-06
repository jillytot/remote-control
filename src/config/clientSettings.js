const { serverPort } = require("./serverSettings");

const host = {
  local: "http://localhost"
};

const api = {
  api: "/api",
  signup: "/signup",
  auth: "/auth",
  login: "/login",
  robotServers: "/robot-server",
  listRobotServers: "/list"
};

module.exports = {
  socketUrl: `${host.local}:${serverPort}`,
  apiUrl: `${host.local}:${serverPort}${api.api}`,
  apiAuth: `${host.local}:${serverPort}${api.api}${api.auth}`,
  apiSignup: `${host.local}:${serverPort}${api.api}${api.signup}`,
  apiLogin: `${host.local}:${serverPort}${api.api}${api.login}`,
  listRobotServers: `${host.local}:${serverPort}${api.api}${api.robotServers}${
    api.listRobotServers
  }`,
  reCaptchaSiteKey: "6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo"
};

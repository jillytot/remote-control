const { serverPort } = require("./serverSettings");

const reCaptchaKey = "6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo";

const ws = "ws://";
const http = "http://";
const api = "/api";

const localHost = "localhost";
const devServer = "35.185.203.47";

const host = localHost;
const apiUrl = `${http}${host}:${serverPort}${api}`;
const socketUrl = `${ws}${host}:${serverPort}`;

module.exports = {
  defaultRate: 1000, //Message rate limit for most people
  minRate: 250, //Message rate limit for admins / server owners etc..
  slowMo: 30000, //Message rate limit for when we need to slow things down!
  chatCharMax: 300, //Maximum amount of characters a user can type in the chat box
  reCaptchaSiteKey: reCaptchaKey,
  socketUrl: socketUrl,
  apiUrl: apiUrl,
  apiAuth: `${apiUrl}/auth`,
  apiSignup: `${apiUrl}/signup`,
  apiLogin: `${apiUrl}/login`,
  listRobotServers: `${apiUrl}/robot-server/list`,
  addServer: `${apiUrl}/robot-server/create`,
  addChannel: `${apiUrl}/channels/create`,
  deleteChannel: `${apiUrl}/channels/delete`,
  addRobot: `${apiUrl}/robot/setup`,
  deleteRobot: `${apiUrl}/robot/delete`,
  robotAPIKey: `${apiUrl}/robot/key`
};

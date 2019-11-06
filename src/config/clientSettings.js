const { serverPort } = require("./serverSettings");

const reCaptchaKey = "6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo";

let http = "http://";
let ws = "ws://";
if (window.location.protocol == "https:") {
  ws = "wss://";
  http = "https://";
}

const apiVersion = "/dev";
const api = `/api${apiVersion}`;

const localHost = "localhost"; //default
const devServer = "35.185.203.47";

//If you want to run just the frontend, change this to "devServer";
const host = localHost;
//Then you can run "npm run react" to start.

const apiUrl = `${http}${host}:${serverPort}${api}`;
const socketUrl = `${ws}${host}:${serverPort}`;

module.exports = {
  defaultRate: 1000, //Message rate limit for most people
  minRate: 250, //Message rate limit for admins / server owners etc..
  slowMo: 30000, //Message rate limit for when we need to slow things down!
  chatCharMax: 300, //Maximum amount of characters a user can type in the chat box
  buttonRate: 100, //Pulse rate for holding down a button
  breakPoint: 768, //mobile layout resolution
  mobileMessageFadeOut: 5000, //how long do mobile messages display in chat before they fade out
  reCaptchaSiteKey: reCaptchaKey,
  socketUrl: socketUrl,
  apiUrl: apiUrl,
  apiAuth: `${apiUrl}/auth`,
  apiSignup: `${apiUrl}/signup`,
  apiLogin: `${apiUrl}/login`,
  listRobotServers: `${apiUrl}/robot-server/list`,
  addServer: `${apiUrl}/robot-server/create`,
  joinServer: `${apiUrl}/robot-server/join`,
  leaveServer: `${apiUrl}/robot-server/leave`,
  addChannel: `${apiUrl}/channels/create`,
  deleteChannel: `${apiUrl}/channels/delete`,
  addRobot: `${apiUrl}/robot/setup`,
  deleteRobot: `${apiUrl}/robot/delete`,
  robotAPIKey: `${apiUrl}/robot/key`,
  getInvites: `${apiUrl}/robot-server/invites`,
  getStats: `${apiUrl}/stats`,
  listFollowedServers: `${apiUrl}/user/followed`,
  makeButtons: `${apiUrl}/controls/make`,
  getButtons: `${apiUrl}/controls/button-input`,
  findServer: `${apiUrl}/robot-server/get-server`,
  setServerListing: `${apiUrl}/robot-server/settings/listing`,
  setServerPrivate: `${apiUrl}/robot-server/settings/private`,
  updateSettings: `${apiUrl}/robot-server/settings/update`,
  validateResetKey: `${apiUrl}/user/validate-key`,
  passwordReset: `${apiUrl}/user/password-reset`,
  getControls: `${apiUrl}/controls/get-controls`,
  validateInviteKey: `${apiUrl}/robot-server/validate-invite`,
  disableInvite: `${apiUrl}/robot-server/deactivate-invite`
};

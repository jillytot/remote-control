const overrides = require("./overides");

const apiUrl = overrides.apiUrl || `http://localhost:3231/api/dev`;
const socketUrl = overrides.socketUrl || `ws://localhost:3231`;

const defaults = {
  defaultRate: 1000, //Message rate limit for most people
  minRate: 250, //Message rate limit for admins / server owners etc..
  slowMo: 30000, //Message rate limit for when we need to slow things down!
  chatCharMax: 300, //Maximum amount of characters a user can type in the chat box
  buttonRate: 100, //Pulse rate for holding down a button
  breakPoint: 768, //mobile layout resolution
  mobileMessageFadeOut: 5000, //how long do mobile messages display in chat before they fade out
  reCaptchaSiteKey: "6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo",
  patreonClientID:
    "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  urlPrefix: "https://remo.tv/",
  socketUrl: socketUrl,
  apiUrl: apiUrl,
  recoveryPage: overrides.recoveryPage || "https://remo.tv/recovery",
  ws: overrides.ws || "ws://",
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
  requestPasswordReset: `${apiUrl}/user/request-password-reset`, //No Auth
  validateResetKey: `${apiUrl}/user/validate-key`,
  passwordReset: `${apiUrl}/user/password-reset`, //execute reset w/ valid key
  getControls: `${apiUrl}/controls/get-controls`,
  validateInviteKey: `${apiUrl}/robot-server/validate-invite`,
  disableInvite: `${apiUrl}/robot-server/deactivate-invite`,
  userProfile: `${apiUrl}/user/profile`,
  updateEmail: `${apiUrl}/user/update-email`,
  invite: `${apiUrl}/robot-server/invite`,
  getMembers: `${apiUrl}/robot-server/get-members`,
  kickMember: `${apiUrl}/moderation/kick`,
  linkPatreon: `${apiUrl}/integrations/patreon`
};

module.exports = Object.assign({}, defaults, overrides);

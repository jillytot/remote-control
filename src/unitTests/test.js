const robotServer = require("../models/robotServer");
const {
  getLocalTypes,
  getRobotServer,
  deleteRobotServer,
  validateOwner,
  checkServerName
} = robotServer;
const user = require("../models/user");
const { getUserInfoFromId } = user;
const robot = require("../models/robot");
const { getRobotFromId } = robot;

const { getChannels, deleteChannel } = require("../models/channel");

const testUserId = "user-2791c4f8-8b0b-40c5-8f21-709217321a6c"; //derp
const testServerId = "serv-a7602128-fe97-42f9-9527-7298501fdf1e"; //herp
const deleteServerId = "serv-e04a0850-50f5-4ca8-889b-b25ab7f63f52";
const testChannel = "chan-1b727055-c814-4239-95f4-0d6a69ec6b72";
const testRobot = "rbot-9ae3d965-c0ed-4300-b16f-f184f8b7af61";
const testName = "remo";

const testInvite = {
  id: "join-a2500ebe-4d75-4bb5-9a54-75e2da282668",
  created_by: "user-2791c4f8-8b0b-40c5-8f21-709217321a6c",
  server_id: "serv-cf6dea8c-3b97-4145-adce-c43ae53ecca8",
  created: "1572911931458",
  expires: "",
  status: "inactive"
};

const testStr = "shitty ass person you are phawk";

const test = async () => {
  try {
    await test___serverName();
    // await test___getRobotServerSettings();
    // await test___deepFilterMessage();
    // await test___filterPhoneticMessage();
    // await test___filterTextMessage();
    // await test___makeInviteAlias();
    // await test__updateInviteStatus();
    // await test__checkServerName();
    // await test__deleteChannel();
    // await test__getRobotFromId();
    // await test__getChannels();
    // await test__validateOwner();
    // await test__getLocalTypes();
    // await test__getUserInfoFromId();
    // await test__getRobotServer();
    // await test__deleteRobotServer();
  } catch (err) {
    console.log(err);
  }

  process.exit(0);
};

const test___serverName = async () => {
  const { validateServerName } = require("../controllers/validate");
  const result = await validateServerName("ad min");
  console.log(result);
};

const test___getRobotServerSettings = async () => {
  const { getRobotServerSettings } = require("../models/robotServer");
  const testData = "serv-a7602128-fe97-42f9-9527-7298501fdf1e";
  const result = await getRobotServerSettings(testData);
  console.log(result, result.settings.default_channel);
};

const test___deepFilterMessage = async () => {
  const { deepFilterMessage } = require("../controllers/chatFilter");
  const result = await deepFilterMessage(testStr);
  console.log(result);
};

const test___filterPhoneticMessage = async () => {
  const { filterPhoneticMessage } = require("../controllers/chatFilter");
  const result = await filterPhoneticMessage(testStr);
  console.log("TEST RESULT: ", result);
};

const test___filterTextMessage = async () => {
  const { filterTextMessage } = require("../controllers/chatFilter");
  const result = await filterTextMessage(testStr);
  console.log(result);
};

const test___makeInviteAlias = async () => {
  const { makeInviteAlias } = require("../controllers/members");
  const result = await makeInviteAlias("qrr112");
  console.log(result);
};

const test__updateInviteStatus = async () => {
  const { updateInviteStatus } = require("../models/invites");
  const result = await updateInviteStatus(testInvite);
  console.log(result);
};

const test__checkServerName = async () => {
  const result = await checkServerName(testName);
  console.log("Check Name for Dupes: ", result);
};

const test__getRobotFromId = async () => {
  const result = await getRobotFromId(testRobot);
  console.log("Test getRobotFromId: ", result);
};

const test__deleteChannel = async () => {
  const result = await deleteChannel(testChannel);
  console.log("Test deleteChannel: ", result);
};

const test__validateOwner = async () => {
  const result = await validateOwner(testUserId, testServerId);
  console.log("test__validateOwner, expect True: ", result);
};

const test__getChannels = async () => {
  const result = await getChannels(testServerId);
  console.log("test__getChannels: ", result);
};

const test__deleteRobotServer = async () => {
  console.log(
    "Deleting Robot Server ...",
    await deleteRobotServer(deleteServerId)
  );
};

const test__getRobotServer = async () => {
  console.log(
    `Should return a single Robot Server: `,
    await getRobotServer(testServerId)
  );
};

const test__getLocalTypes = async () => {
  console.log(
    `Should return ['owner']: `,
    await getLocalTypes(testServerId, testUserId)
  );
};

const test__getUserInfoFromId = async () => {
  console.log(
    `Should Return User "derp": `,
    await getUserInfoFromId(testUserId)
  );
};

test();

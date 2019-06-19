const robotServer = require("../models/robotServer");
const {
  getLocalTypes,
  getRobotServer,
  deleteRobotServer,
  validateOwner
} = robotServer;
const user = require("../models/user");
const { getUserInfoFromId } = user;
const robot = require("../models/robot");
const { getRobotFromId } = robot;

const { getChannels, deleteChannel } = require("../models/channel");

const testUserId = "user-2791c4f8-8b0b-40c5-8f21-709217321a6c"; //derp
const testServerId = "serv-51869953-62f2-4464-abb8-3266221c58de"; //herp
const deleteServerId = "serv-e04a0850-50f5-4ca8-889b-b25ab7f63f52";
const testChannel = "chan-1b727055-c814-4239-95f4-0d6a69ec6b72";
const testRobot = "rbot-9ae3d965-c0ed-4300-b16f-f184f8b7af61";

const test = async () => {
  try {
    // await test__deleteChannel();
    await test__getRobotFromId();
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

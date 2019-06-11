const robotServer = require("../models/robotServer");
const { getLocalTypes, getRobotServer } = robotServer;
const user = require("../models/user");
const { getUserInfoFromId } = user;

const testUserId = "user-810c7f96-47ad-4408-a8a2-3c9274fa2898"; //derp
const testServerId = "serv-ee73da73-f6a8-442a-b207-02fe28dde8b0"; //herp

const test = async () => {
  try {
    await test_getLocalTypes();
    await test_getUserInfoFromId();
    await test_getRobotServer();
  } catch (err) {
    console.log(err);
  }

  process.exit(0);
};

const test_getRobotServer = async () => {
  console.log(
    `Should return a single Robot Server: `,
    await getRobotServer(testServerId)
  );
};

const test_getLocalTypes = async () => {
  console.log(
    `Should return ['owner']: `,
    await getLocalTypes(testServerId, testUserId)
  );
};

const test_getUserInfoFromId = async () => {
  console.log(
    `Should Return User "derp": `,
    await getUserInfoFromId(testUserId)
  );
};

test();

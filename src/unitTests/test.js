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
    await test___misc();
    // await test___validateEmail();
    // await test___getPledgeData();
    // await test___syncPatreonData();
    // await test___getRemoPeldgeData();
    // await test___serverName();
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
    console.log("TEST ERROR: ", err);
  }

  process.exit(0);
};

const test___misc = async () => {
  return null;
};

const test___validateEmail = async () => {
  const { validateEmail } = require("../controllers/validateEmail");
  let user = {};
  user.id = "user-2791c4f8-8b0b-40c5-8f21-709217321a6c";
  const test = await validateEmail(user);
  console.log(test);
  console.log("Done");
};

const test___getPledgeData = async () => {
  const { getPledgeData } = require("../modules/patreon");
  const { campaignId } = require("../config/server");

  try {
    let pledges = [];
    const { data, included } = await getPledgeData();
    // console.log("pledges: ", data.length, "included: ", included.length);
    data.map(item => {
      const { relationships } = item;
      if (relationships.reward.data && relationships.reward.data.id) {
        let pledge = {
          patreon_id: relationships.patron.data.id,
          reward_id: relationships.reward.data.id
        };

        included.map(item => {
          if (item.type === "reward" && item.id === pledge.reward_id) {
            pledge.reward_title = item.attributes.title;
            pledge.reward_amount = item.attributes.amount;
            // console.log(item.attributes);
          }
        });

        // console.log("Pledge: ", pledge);
        pledges.push(pledge);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const test___syncPatreonData = async () => {
  const { getPatreonData } = require("../controllers/patreon");
  await getPatreonData();
  console.log("Done");
};

const test___getRemoPeldgeData = async () => {
  const { getRemoPledgeData } = require("../modules/patreon");
  const { campaignId } = require("../config/server");
  const pledges = await getRemoPledgeData();

  try {
    console.log("Pledges: ", pledges.length);
    pledges.map(pledge => {
      if (pledge.creator && pledge.patron && pledge.reward) {
        console.log("Patron Id", pledge.patron.id);
        console.log("Reward Title", pledge.reward.title);
        console.log("Reward ID: ", pledge.reward.id);
        console.log("Campaign Id", pledge.reward.campaign.id);
        //console.log(pledge.reward);
        if (pledge.reward.campaign.id === campaignId) {
          console.log("Save Data");
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
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

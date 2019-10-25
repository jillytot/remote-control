//Make sure every channel has a control ID assigned
//Make sure that control ID is the most up to date one
//Make sure there are no duplicated "controls" for a channel

//TEST THIS WITH DIFFERENT DATA BEFORE USING ON PROD
//Accidently already cleaned up dupes on local DB. - Check to see if can revert local db
const clean = async () => {
  let cleanUp = await dirtyChannels();
  cleanUp = await findControls(cleanUp);
  cleanUp = await handleProblemChannels(cleanUp);
  if (cleanUp === true) {
    console.log("Channel Cleanup Successful!");
  } else {
    console.log("Channel Cleanup incomplete");
  }
  //console.log("Cleanup Result: ", cleanUp);
  process.exit(1);
};

//If no controls have even been generated for a channel, add them here.
const handleProblemChannels = async problems => {
  const { createControls } = require("../models/controls");
  let fixed = 0;
  const total = problems.length;
  const promises = problems.map(async problem => {
    console.log(`Make Controls For: ${problem.id}`);
    let fix = await createControls({ channel_id: problem.id });
    fix = await assignControls(problem, fix);
    console.log(`Create Controls Result:  ${problem.id}`);
    if (fix) fixed += 1;
  });
  await Promise.all(promises);
  console.log(`${fixed} out of ${total} problem channels fixed...`);
  if (fixed === total) return true;
  return false;
};

//Triage channels with unassigned channel controls
const findControls = async dirtyChannels => {
  const { getAllControls, removeControls } = require("../models/controls");
  let problemChannels = [];
  const controls = await getAllControls();
  console.log("Getting Controls: ", controls.length);

  const promises = dirtyChannels.map(async dirty => {
    let getDupes = await controls.filter(ui => ui.channel_id === dirty.id);
    console.log("Entries found for channel: ", dirty.name, getDupes.length);
    if (getDupes.length < 1) problemChannels.push(dirty);
    if (getDupes.length === 1) assignControls(dirty, getDupes[0]);
    if (getDupes.length > 1) {
      getDupes = await getDupes.sort(compare);
      getDupes.forEach(async (dupe, index) => {
        if (index === 0) {
          await assignControls(dirty, dupe);
        } else {
          await removeControls(dupe);
        }
      });
    }
  });

  await Promise.all(promises);
  return problemChannels;
};

//assign controls to a channel
const assignControls = async (channel, ui) => {
  const { setControls } = require("../models/channel");
  console.log(`Set controls for channel: ${channel.id} controls: ${ui.id}`);
  const assign = await setControls({ id: ui.id, channel_id: channel.id });
  console.log("Setting Controls for Channel", assign.name, assign.controls);
  return assign;
};

//identify channels without controls assigned
const dirtyChannels = async () => {
  const { getAllChannels } = require("../models/channel");
  const channels = await getAllChannels();
  console.log("Found Channels: ", channels.length);

  let dirtyChannels = [];
  await channels.map(channel => {
    if (!channel.controls || channel.controls === null) {
      dirtyChannels.push(channel);
      console.log("No Controls Id: ", channel.id);
    }
  });

  console.log(
    "Found channels with no controls assignment: ",
    dirtyChannels.length
  );

  return dirtyChannels;
};

const compare = async (a, b) => {
  const serverA = a.created;
  const serverB = b.created;

  let comparison = 0;
  if (serverA > serverB) {
    comparison = 1;
  } else if (serverA < serverB) {
    comparison = -1;
  }
  return comparison * -1;
};

clean();

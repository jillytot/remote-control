//Make sure every channel has a control ID assigned
//Make sure that control ID is the most up to date one
//Make sure there are no duplicated "controls" for a channel

//TEST THIS WITH DIFFERENT DATA BEFORE USING ON PROD
//Accidently already cleaned up dupes on local DB. - Check to see if can revert local db
const clean = async () => {
  let cleanUp = await dirtyChannels();
  cleanUp = await findControls(cleanUp);

  console.log("Cleanup Result: ", cleanUp);
  process.exit(1);
};

const findControls = async dirtyChannels => {
  const { getAllControls } = require("../models/controls");
  let problemChannels = [];
  const controls = await getAllControls();
  console.log("Getting Controls: ", controls.length);

  const promises = dirtyChannels.map(async dirty => {
    console.log("Checking Dirty Channel: ", dirty.name);
    let getDupes = await controls.filter(ui => ui.channel_id === dirty.id);
    console.log("Entries found for channel: ", dirty.name, getDupes.length);
    if (getDupes.length === 0) {
      problemChannels.push(dirty);
    } else {
      //assign the most recently created dupe channel
    }
  });

  await Promise.all(promises);
  return problemChannels;
};

const assignControls = async (channel, ui) => {
  const { setControls } = require("../models/channel");
  console.log("Assigning Controls to Channels");
  const assign = await setControls({ id: ui.id, channel_id: channel.id });
  console.log("Setting Controls for Channel", assign.name, assign.controls);
  return assign;
};

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

const organizeDupes = async dupes => {
  const sortDupes = await dupes.sort(compare);
  return sortDupes[0];
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

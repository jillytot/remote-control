//search db / controls model for duplicate channel ID's.
//If found, remove older entries, and only keep the newest one.

const removeControlDupes = async () => {
  const { getAllControls, removeControls } = require("../models/controls");
  const { setControls } = require("../models/channel");
  const listControls = await getAllControls();
  console.log("Entries Found: ", listControls.length);
  const promises = listControls.map(dupeCheck => {
    return async () => {
      let getDupes = listControls.filter(
        listItem => listItem.channel_id === dupeCheck.channel_id
      );
      if (getDupes[1]) {
        console.log("DUPES FOUND!: ", getDupes.length);
        await getDupes.sort(compare);
        await getDupes.forEach(async (dupe, index) => {
          console.log(dupe.created, index);
          if (index === 0) {
            //set channel controls to this control
          } else {
            const result = await removeControls(dupe);
            console.log(result);
          }
        });
      }
    };
  });

  await Promise.all(promises);
  process.exit(1);
};

const enforceDefaultControls = async () => {};

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

removeControlDupes();

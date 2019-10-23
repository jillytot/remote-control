//search db / controls model for duplicate channel ID's.
//If found, remove older entries, and only keep the newest one.

const removeControlDupes = async () => {
  const { getAllControls } = require("../models/controls");
  const listControls = await getAllControls();
  //   console.log(listControls);
  await listControls.map(dupeCheck => {
    const getDupes = listControls.filter(
      listItem => listItem.channel_id === dupeCheck.channel_id
    );
    if (getDupes[1]) {
      console.log("DUPES FOUND!: ");
      getDupes.map(dupe => {
        console.log(dupe.id, dupe.channel_id, dupe.created);
      });
    }
  });
};

removeControlDupes();

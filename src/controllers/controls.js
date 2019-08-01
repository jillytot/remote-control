//default example for controls
const example = [
  { label: "forward", hot_key: "w", command: "f" },
  { label: "back", hot_key: "s", command: "b" },
  { label: "left", hot_key: "a", command: "l" },
  { label: "right", hot_key: "d", command: "r" }
];

module.exports.getButtonInput = async controls_id => {
  const { getControlsFromId } = require("../models/controls");
  const controls = await getControlsFromId(controls_id);
  if (controls.button_input) return controls.button_input;
  return example;
};

module.exports.saveButtonInput = async (controls_id, button_input) => {
  const { storeButtonInput } = require("../models/controls");
  const save = await storeButtonInput(controls_id, button_input);
  console.log("Buttons Saved! ", save);
  if (save) return save;
  return null;
};

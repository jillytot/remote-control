const { calcTimeout } = require("../models/chatCommands");

const test = async () => {
  let input = process.argv[2];
  let param = process.argv[3];
  console.log(input);

  if (input && input === "calcTimeout") {
    if (param) {
      console.log(calcTimeout(param));
    } else {
      console.log("This test requires at least 1 additional parameter");
      process.exit(1);
    }
  }

  console.log("Exiting Process!");
  process.exit(1);
};

test();

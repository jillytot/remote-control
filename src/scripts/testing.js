const { calcTimeout } = require("../models/chatCommands");
const { validateUser, getIdFromUsername } = require("../models/user");

const test = async () => {
  let input = process.argv[2];
  let param = process.argv[3];
  let param2 = process.argv[4];
  let param3 = process.argv[5];
  console.log(input);

  if (input && input === "calcTimeout") {
    if (param) {
      console.log(calcTimeout(parseInt(param)));
    } else {
      console.log("This test requires at least 1 additional parameter");
      process.exit(1);
    }
  }

  if (input && input === "timeout") {
    const identifier = param;
    const id = param2;
    const time = param3;

    if (param === "username") {
      console.log("Timeout user based on username: ", param2);
      if (param2) {
        const check = await validateUser({
          [param]: param2.toLocaleLowerCase()
        });
        console.log("CHECK VALIDATION: ", check);
      }
    }
  }

  console.log("Exiting Process!");
  process.exit(1);
};

test();

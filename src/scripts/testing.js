const { calcTimeout } = require("../models/chatCommands");
const {
  validateUser,
  getIdFromUsername,
  getUserInfoFromId,
  timeoutUser
} = require("../models/user");

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
    let identifier = null;
    let getUser = null;
    let time = null;
    if (param && param2 && param3) {
      identifier = param;
      getUser = param2;
      time = param3;
    } else {
      console.log(
        "Missing arguments for timeout, please provide an identifier, (i.e. username or id) followed by the username or id, then the amount by which to be timed out (in seconds)"
      );
      process.exit(1);
    }

    if (identifier === "username") {
      console.log("Timeout user based on username: ", getUser);
      if (getUser) {
        const check = await validateUser({
          [identifier]: getUser.toLocaleLowerCase()
        });
        console.log("CHECK VALIDATION: ", check);
        if (check) {
          let thisUser = await getIdFromUsername(getUser);
          thisUser = await getUserInfoFromId(thisUser);
          thisUser = await timeoutUser(thisUser, time);
          console.log("THIS SHOULD RETURN TRUE AFTER TIMEOUT ENDS: ", thisUser);
          //process.exit(1);
        }
      }
    }
  }

  console.log("Exiting Process!");
  //process.exit(1);
};

test();

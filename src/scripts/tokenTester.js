const {
  verifyAuthToken,
  createAuthToken,
  getIdFromUsername,
  extractToken
} = require("../models/user");

const validate = async () => {
  let check = process.argv[2];
  let input = process.argv[3];
  console.log("Checking Token...");

  if (check === "id") {
    console.log("...Genenerating Token from ID:", input);
    let token = await createAuthToken({ id: input });
    console.log("Token Created: ", token);
  } else if (check === "token") {
    console.log("...Extracting Token:", input);
  } else if (check === "username") {
    console.log("...Getting userId from DB with username: ", input);
  } else {
    console.log("Invalid Operation, the first argument must be: id or: token");
    process.exit(1);
  }

  console.log("Process Complete!");
  process.exit(1);
};

validate();

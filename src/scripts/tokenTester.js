const {
  createAuthToken,
  getIdFromUsername,
  extractToken,
  getUserInfoFromId
} = require("../models/user");

const validate = async () => {
  let check = process.argv[2];
  let input = process.argv[3];
  console.log("Checking Token...");

  //Encode Info to Token
  if (check === "id") {
    console.log("...Genenerating Token from ID:", input);
    let token = await createAuthToken({ id: input });
    console.log("Token Created: ", token);

    //Extract info from token
  } else if (check === "token") {
    console.log("...Extracting Token:", input);
    let result = await extractToken(input);
    console.log(result, result.id);
    result = await getUserInfoFromId(result["id"]);
    console.log("Token Extracted: ", result);

    //Get UserId from Username, then encode Token
  } else if (check === "username") {
    console.log("...Getting userId from DB with username: ", input);
    const userId = await getIdFromUsername(input);
    console.log("...Generating Token from ID: ", userId);
    const token = await createAuthToken({ id: userId });
    console.log("Token Created: ", token);
    //Else Errors!
  } else {
    console.log("Invalid Operation, the first argument must be: id or: token");
    process.exit(1);
  }

  console.log("Process Complete!");
  process.exit(1);
};

validate();

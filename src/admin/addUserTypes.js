const {
  addUserTypes,
  userTypes,
  validateUser,
  getIdFromUsername
} = require("../models/user");

const validate = async () => {
  //console.log(process.argv);
  let types = process.argv.slice(4);
  let user = process.argv[3];
  let identifier = process.argv[2];
  console.log("Set Type(s) for User: ", identifier, user, types);

  if (identifier === "id") {
    //Check if user exists:
    await validateUser({
      [identifier]: user
    });
  } else if (identifier === "username") {
    await validateUser({
      [identifier]: user
    });

    identifier = "id";
    user = await getIdFromUsername(user);
  } else {
    console.log(
      `"Invalid Identifier: ${identifier} "The first argument must be 'username' or 'id'.`
    ),
      process.exit(1);
  }

  //Check if valid type
  types.map(type => {
    if (userTypes.includes(type) === false) {
      console.log("Invalid Type: ", type), process.exit(1);
    }
  });

  //remove dupes (if any)
  types = Array.from(new Set(types));
  console.log("Removing Dupes (if any): ", types);

  console.log("Validation Passed");
  //set the type!

  const res = await addUserTypes(user, types);
  console.log("Successfully Added User Types: ", res);
  process.exit();
};

validate();

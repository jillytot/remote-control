const {
  addUserRoles,
  userRoles,
  validateUser,
  getIdFromUsername
} = require("../models/user");

const validate = async () => {
  let roles = process.argv.slice(4);
  let identifier = process.argv[2];
  let user = process.argv[3];
  console.log("Set Type(s) for User: ", identifier, user, roles);

  //Does this user exist?
  if (identifier === "id") {
    //Check based on user id
    const check = await validateUser({
      [identifier]: user
    });

    if (!check) {
      console.log("Invalid User ID, Existing Process");
      process.exit(1);
    }
  } else if (identifier === "username") {
    //check based on username
    const check = await validateUser({
      [identifier]: user.toLocaleLowerCase()
    });
    console.log("CHECK VALIDATION: ", check);
    if (!check) {
      console.log("Invalid Username, Existing Process");
      process.exit(1);
    }
    identifier = "id";
    user = await getIdFromUsername(user);
  } else {
    console.log(
      `"Invalid Identifier: ${identifier} "The first argument must be 'username' or 'id'.`
    ),
      process.exit(1);
  }

  //Check if valid type
  roles.map(type => {
    if (userRoles.includes(type) === false) {
      console.log("Invalid Type: ", type), process.exit(1);
    }
  });

  //remove dupes (if any)
  roles = Array.from(new Set(roles));
  console.log("Removing Dupes (if any): ", roles);
  console.log("...Validation Complete, adding user roles to DB");

  //set the type!
  const res = await addUserRoles(user, roles);
  console.log("Successfully Added User Roles: ", res);
  process.exit();
};

validate();

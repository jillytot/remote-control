const { setNewPassword } = require("../controllers/user");

const setPassword = async () => {
  let user_id = process.argv[2];
  let newPassword = process.argv[3];
  console.log(user_id, newPassword);
  const reset = await setNewPassword(user_id, newPassword);
  console.log("Set Password Result: ", reset);
  process.exit();
};

setPassword();

//GENERATE UNIQUE ID
module.exports.makeId = () => {
  const uuidv4 = require("uuid/v4");
  const generate = uuidv4();
  //TODO: Check and see if ID already exists after generating
  return generate;
};

//ENCRYPT PASSWORD:
module.exports.hash = async pw => {
  const bcrypt = require("bcrypt");
  const saltRounds = 10; //!!!!!!Don't leave this on a public repo. !!!!!!!!

  const hashed = await new Promise((resolve, reject) => {
    bcrypt.hash(pw, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashed;
};

module.exports.createTimeStamp = () => {
  return Date.now();
};

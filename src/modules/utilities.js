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

module.exports.checkHash = (pw, hash) => {
  console.log("...Checking Hash.");
  const bcrypt = require("bcrypt");
  const checkHash = new Promise((resolve, reject) => {
    bcrypt.compare(pw, hash, function(err, res) {
      if (err) reject(err);
      console.log(res);
      resolve(res);
    });
  });
  return checkHash;
};

module.exports.createTimeStamp = () => {
  return Date.now();
};

module.exports.createTimer = (interval, callback, object) => {
  console.log("DING");
  const timer = new setInterval(() => {
    callback(object);
    clearInterval(timer);
  }, interval);
  console.log(interval, callback, object);
};

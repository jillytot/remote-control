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

module.exports.createSimpleTimer = (interval, callback) => {
  console.log("DING");
  const timer = new setInterval(() => {
    callback();
    clearInterval(timer);
  }, interval);
  console.log(interval, callback);
};

module.exports.isEqual = (value, other) => {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
  const valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  if (type === "[object Array]") {
    for (let i = 0; i < valueLen; i++) {
      if (this.compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (let key in value) {
      if (value.hasOwnProperty(key)) {
        if (this.compare(value[key], other[key]) === false) return false;
      }
    }
  }

  return true;
};

module.exports.compare = (item1, item2) => {
  const itemType = Object.prototype.toString.call(item1);
  if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
    if (!isEqual(item1, item2)) return false;
  } else {
    if (itemType !== Object.prototype.toString.call(item2)) return false;
    if (itemType === "[object Function]") {
      if (item1.toString() !== item2.toString()) return false;
    } else {
      if (item1 !== item2) return false;
    }
  }
  return true;
};

module.exports.getArrayDifference = (array1, array2, select) => {
  function comparer(otherArray) {
    return function(current) {
      return (
        otherArray.filter(function(other) {
          return (
            other.value == current.value && other.display == current.display
          );
        }).length == 0
      );
    };
  }
  var onlyInA = array1.filter(comparer(array2));
  var onlyInB = array2.filter(comparer(array1));
  const result = onlyInA.concat(onlyInB);
  console.log("Get Array Difference Result: ", result);
  if (select && select === 1) return onlyInA;
  if (select && select === 2) return onlyInB;
  return onlyInA.concat(onlyInB);
};

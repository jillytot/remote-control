let usernames = [];
let ips = [];
const cooldown = 300000;

Array.prototype.remove = function() {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

module.exports.addUser = user => {
  const { createTimer } = require("../modules/utilities");
  console.log("adding user: ", user);
  if (usernames.includes(user)) {
    console.log(usernames);
    return true;
  } else {
    usernames.push(user);
    createTimer(cooldown, usernames.remove, user);
    console.log(usernames);
    return false;
  }
};

module.exports.addIp = ip => {
  const { createTimer } = require("../modules/utilities");
  console.log("adding ip: ", ip);
  if (ips.includes(ip)) {
    console.log("ips: ", ips);
    return true;
  } else {
    ips.push(ip);
    createTimer(cooldown, ips.remove, ip);
    console.log("ips: ", ips);
    return false;
  }
};

module.exports.getUsernames = () => {
  return usernames;
};

module.exports.getIps = () => {
  return ips;
};

let usernames = [];
let ips = [];
const { authRequestTimeout } = require("../config/server");

//This script is meant to help throttle security related requests like requesting a password reset
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
    createTimer(authRequestTimeout, removeUsername, user);
    console.log(usernames);
    return false;
  }
};

const removeUsername = username => {
  usernames.remove(username);
};

module.exports.addIp = ip => {
  const { createTimer } = require("../modules/utilities");
  console.log("adding ip: ", ip);
  if (ips.includes(ip)) {
    console.log("ips: ", ips);
    return true;
  } else {
    ips.push(ip);
    createTimer(authRequestTimeout, removeIp, ip);
    console.log("ips: ", ips);
    return false;
  }
};

const removeIp = ip => {
  ips.remove(ip);
};

module.exports.getUsernames = () => {
  return usernames;
};

module.exports.getIps = () => {
  return ips;
};

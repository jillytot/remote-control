module.exports.ip = req => {
  const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
  return ip;
};

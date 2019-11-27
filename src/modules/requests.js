module.exports.ip = req => {
  return req.connection.remoteAddress;
};

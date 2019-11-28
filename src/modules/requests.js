module.exports.ip = req => {
  const ip = req.headers["x-real-ip"] || "localHost";
  return ip;
};

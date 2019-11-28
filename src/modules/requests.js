module.exports.ip = req => {
  const ip = req.headers["x-forwarded-for"] || "localHost";
  return ip;
};

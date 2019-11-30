const overides = require("./overrides");

const defaults = {
  internalKey: undefined, // Undefined for disabled
  serverPort: 3231,
  heartBeat: 10000,
  liveStatusInterval: 15000,
  secret: "temp_secret",
  reCaptchaSecretKey: "6Lfg_KYUAAAAAILikAGmfmaR3IvYw3eeucDBp-TU",
  maxTimeout: 15768000, //Seconds, not milliseconds
  loadMessages: 25, //number of messages chatroom will get on load
  currentAPIVersion: "/dev",
  passResetExpires: 900 * 1000, //about 15 minutes (in ms)
  logLevel: "debug",
  sendGrid: "",
  sendMail: "",
  authRequestTimeout: 300 * 1000, //5 minutes
  urlPrefix: "https://remo.tv/",
  db: {
    user: "postgres",
    password: "",
    database: "remote_control",
    host: "localhost",
    port: 5432,
    max: 50,
    idleTimeoutMillis: 30000
  }
};

module.exports = Object.assign({}, defaults, overides);

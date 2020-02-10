const overides = require("./overrides");

const defaults = {
  internalKey: undefined, // Undefined for disabled
  serverPort: 3231,
  heartBeat: 10000,
  liveStatusInterval: 15000,
  secret: "temp_secret",
  reCaptchaSecretKey: overides.reCaptchaSecretKey,
  maxTimeout: 15768000, //Seconds, not milliseconds
  loadMessages: 25, //number of messages chatroom will get on load
  currentAPIVersion: "/dev",
  passResetExpires: 900 * 1000, //about 15 minutes (in ms)
  emailValidationExpires: 3600 * 1000 * 24, //24 hours
  logLevel: "debug",
  sendGrid: overides.sendGrid,
  sendMail: "",
  authRequestTimeout: 300 * 1000, //5 minutes
  urlPrefix: "https://remo.tv/",
  supportEmail: "jill@remo.tv",
  reRouteOutboundEmail: "",

  //PATREON STUFF
  patreonClientID:
    "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  patreonClientSecret: overides.patreonClientSecret,
  creatorAccessToken: overides.creatorAccessToken,
  creatorRefreshToken: overides.creatorRefreshToken,
  campaignId: "3356897",
  patreonSyncInterval: 30000,

  db: {
    user: "postgres",
    password: "",
    database: "remote_control",
    host: "localhost",
    port: 5432,
    max: 50,
    idleTimeoutMillis: 30000
  },

  //BadWords
  globalBadWordsList: {
    normal_bad_words: {
      //replacement word: [ array, of, bad, word, iterations ]
      example1: ["test1", "test2", "test3"],
      example2: ["word1", "word2", "word3"]
    },
    phonetic_bad_words: {
      //lookup phonetics: https://words.github.io/metaphone/
      // Bad Phonetic Word : Replacement Word
      TST: "example"
    }
  },
  filterWhiteList: [
    "cant",
    "as",
    "count",
    "fact",
    "kind",
    "take",
    "took",
    "dog",
    "duck",
    "fig",
    "neck",
    "pose",
    "piece",
    "pass",
    "shout",
    "sheet",
    "chat"
  ]
};

module.exports = Object.assign({}, defaults, overides);

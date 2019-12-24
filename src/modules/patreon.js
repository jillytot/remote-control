const patreon = require("patreon");
const CLIENT_ID = require("../config/server/").patreonClientID;
const CLIENT_SECRET = require("../config/server/").patreonClientSecret;

const patreonOAuthClient = patreon.oauth(CLIENT_ID, CLIENT_SECRET);

module.exports.patreonGetTokens = async (redirectCode, redirectUri) => {
  try {
    const tokens = await patreonOAuthClient.getTokens(
      redirectCode,
      redirectUri
    );
    console.log("Patreon Tokens: ", tokens);
    return tokens;
  } catch (err) {
    console.log(err);
  }
};

module.exports.getInfoFromAccessToken = async token => {
  try {
    const pledgerClient = patreon.patreon(token);
    const info = await pledgerClient("/current_user");
    console.log("PatreonInfo", info.rawJson);
    console.log(
      "PatreonInfoPledges",
      info.rawJson.data.relationships.pledges.data
    );
    console.log("PatreonInfoIncluded", info.rawJson.included);
  } catch (err) {
    console.log("Get Info Err", err);
  }
};

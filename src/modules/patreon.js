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
  const { jsonError } = require("./logging");
  try {
    const pledgerClient = patreon.patreon(token);
    const info = await pledgerClient("/current_user");

    const { store } = info;
    const getPatron = store.findAll("user").map(user => user.serialize());
    const getPatronId = getPatron[0].data.id;
    // console.log("TEST: ", test, "ID: ", test[0].data.id);
    return getPatronId;
    // test.forEach(t => {
    //   const { attributes, relationships } = t.data;
    //   console.log(
    //     t.data
    //     "ATTRIBUTES: ",
    //     attributes,
    //     "RELATIONSHIPS: ",
    //     relationships
    //   );
    // });
    // console.log("PLEDGES: ", info.rawJson.data.relationships.pledges);
    // console.log("PatreonInfo", info.rawJson);
    // return {
    //   pledges: info.rawJson.data.relationships.pledges.data,
    //   info: info.rawJson.included
    // };
  } catch (err) {
    console.log(err);
    return jsonError("Bad token data.");
  }
};

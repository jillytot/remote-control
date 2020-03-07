const patreon = require("patreon");
const CLIENT_ID = require("../config/server/").patreonClientID;
const CLIENT_SECRET = require("../config/server/").patreonClientSecret;
const axios = require("axios");
const { jsonError } = require("./logging");

/**
 * Patreon Module:
 * TODO: Replace all usage of the patreon client w/ rest calls
 * Patreon client hasn't been updated since 2018 & is no longer supported
 */

const patreonOAuthClient = patreon.oauth(CLIENT_ID, CLIENT_SECRET);

module.exports.patreonGetTokens = async (redirectCode, redirectUri) => {
  try {
    const tokens = await patreonOAuthClient.getTokens(
      redirectCode,
      redirectUri
    );
    // console.log("Patreon Tokens: ", tokens);
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
    const getPatron = await store.findAll("user").map(user => user.serialize());
    let getPatronId = "";
    getPatron.map(patron => {
      // console.log(patron.data);
      if (
        patron.data &&
        patron.data.relationships &&
        patron.data.relationships.pledges
      )
        getPatronId = patron.data.id;
    });
    if (getPatronId === "")
      return jsonError(
        "Unexpected data from Patreon API, please let us know and try again later"
      );

    return getPatronId;
  } catch (err) {
    console.log(err);
    return jsonError("Bad token data.");
  }
};

module.exports.getRemoPledgeData = async () => {
  const { creatorAccessToken, campaignId } = require("../config/server");
  const client = patreon.patreon(creatorAccessToken);

  //stahp spamming my console!
  const result = await client(
    `/campaigns/${campaignId}/pledges?page%5Bcount%5D=10000`
  );
  //TODO: May need a totally different method than using Patreon Module.
  const { store } = result;
  const pledges = store.findAll("pledge");
  return pledges;
};

module.exports.getPledgeData = async () => {
  const { campaignId, creatorAccessToken } = require("../config/server");
  const get = `https://www.patreon.com/api/oauth2/api/campaigns/${campaignId}/pledges?page%5Bcount%5D=10000`;
  return await axios
    .get(get, {
      headers: { authorization: `Bearer ${creatorAccessToken}` }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(
        "Error Fetching Patreon Data: ",
        err.response.status,
        err.response.statusText
      );
      return jsonError(err.response.statusText);
    });
};

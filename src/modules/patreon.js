const url = require("url");
const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const { urlPrefix } = require("../config/server/");

// Use the client id and secret you received when setting up your OAuth account
const CLIENT_ID = require("../config/server/").patreonClientID;
const CLIENT_SECRET = require("../config/server/").patreonClientSecret;
const patreonOAuthClient = patreonOAuth(CLIENT_ID, CLIENT_SECRET);

// This should be one of the fully qualified redirect_uri you used when setting up your oauth account
const redirectURL = `${urlPrefix}patreon`;

module.exports.handleOAuthRedirectRequest = async (request, response) => {
  const oauthGrantCode = url.parse(request.url, true).query.code;

  patreonOAuthClient
    .getTokens(oauthGrantCode, redirectURL)
    .then(tokensResponse => {
      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      return patreonAPIClient("/current_user");
    })
    .then(result => {
      const store = result.store;
      // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
      // You can also ask for result.rawJson if you'd like to work with unparsed data
      response.end(store.findAll("user").map(user => user.serialize()));
    })
    .catch(err => {
      console.error("error!", err);
      response.end(err);
    });
};

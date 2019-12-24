//Modules for Patreon using patreon-js: https://github.com/Patreon/patreon-js

/* The Patreon JS library uses a data store pattern for storing inflated objects from the returned results of API calls. 
In some cases, especially if you have been granted the scopes for being a multi-campaign client or are opted-in to some API beta programs, 
the JS client calling /current_user will fetch the current user's campaign, as well as all the patron users connected to that campaign.

This can result in the user store in the JS library having a larger list of users than expected for a call to /current_user, 
but the current user's user object will be in that list.

Example for finding the actual current user:
var patreon_response = patreon_client('/current_user').then(function(result) {
    user_store = result.store
    let data = result.rawJson
    const myUserId = data.data.id
    creator = user_store.find('user', myUserId)
} */

//This makes a request to grab tokens needed for making API requests, and returns a promise.

module.exports.patreonOAuthClient = async () => {
  const patreon = require("patreon");
  const CLIENT_ID = require("../config/server/").patreonClientID;
  const CLIENT_SECRET = require("../config/server/").patreonClientSecret;
  const patreonOAuth = patreon.oauth;
  const client = await patreonOAuth(CLIENT_ID, CLIENT_SECRET);
  console.log("Patreon Client: ", client);
  return client;
};

//Probably not needed, not sure yet though
module.exports.handleOAuthRedirectRequest = async (request, response) => {
  const patreon = require("patreon");
  const patreonAPI = patreon.patreon;
  const url = require("url");
  const { urlPrefix } = require("../config/server/");
  const patreonOAuthClient = await this.patreonOAuthClient();

  // This should be one of the fully qualified redirect_uri you used when setting up your oauth account
  const redirectURL = `${urlPrefix}patreon`;
  const oauthGrantCode = url.parse(request.url, true).query.code;

  await patreonOAuthClient
    .getTokens(oauthGrantCode, redirectURL)
    .then(tokensResponse => {
      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      return patreonAPIClient("/current_user");
    })
    .then(({ store }) => {
      // store is a [JsonApiDataStore](https://github.com/beauby/jsonapi-datastore)
      // You can also ask for result.rawJson if you'd like to work with unparsed data
      response.end(store.findAll("user").map(user => user.serialize()));
    })
    .catch(err => {
      console.error("error!", err);
      response.end(err);
    });
};

//This makes a request to grab tokens needed for making API requests, and returns a promise.

/* data structure: {
   access_token: 'access_token',
   refresh_token: 'refresh_token',
   expires_in: 'time_window',
   scope: 'users pledges-to-me my-campaign',
   token_type: 'Bearer'
} 

You must pass tokens.access_token in to patreon for making API calls. */
module.exports.patreonGetTokens = async (redirectCode, redirectUri) => {
  try {
    const patreonOAuthClient = await this.patreonOAuthClient();
    console.log("From Get Tokens: ", patreonOAuthClient);
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

//Returns a function for making authenticated API calls.
module.exports.patreonClient = accessToken => {
  const patreon = require("patreon");
  const client = patreon(accessToken);
  console.log("Patreon Client: ", client);
  return client;
};

//Returns a promise representing the result of the API call.
/* If the API call is successful, the promise will resolve with an object containing three pieces:
      store: a JsonApiDataStore. This provides a nice, usable wrapper around the raw JSON:API response to easily access related resources and resource attributes.
      rawJson: a JSON object in the JSON:API format, for advanced custom usage (say, parsing into your own JSON:API data store)
      response: the actual fetch Response object, for the lowest level of response analysis
   If the API call is unsuccessful, the promise will reject with an error. */
module.exports.clientResult = async client => {
  const result = await client(pathname);
  console.log(result);
  return result;
};

/*
Routes
/current_user /current_user/campaigns /campaigns/${campaign_id}/pledges
 */

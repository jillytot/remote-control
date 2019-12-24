//Controller for managing behavior using ../modules/patreon.js

/* TODO: 
Done - User goes to profile and clicks on "link Patreon Account", 
Done - User is taken to page to approve linking account to remo, providing a redirect uri. 
Done - User is redirected back to remo.tv/patreon w/ code, state & uri from patreon auth. 
Current - code, and uri are retrieved from the clientside, then used to make a server side API call to get tokens
Not Done - tokens are saved to user in DB, and used to make api requests through patreon client
Not Done - need to find relevant methods / API Endpoints & add them to ../modules/patreon
*/

//Save Patron info needed to link remo user to user's patreon account

//Get relevant patron info

//Update patron info ( on change )
module.exports.linkPatron = async (code, uri) => {
  const {
    patreonGetTokens,
    getInfoFromAccessToken
  } = require("../modules/patreon");
  const tokens = await patreonGetTokens(code, uri);
  console.log(tokens);
  const info = await getInfoFromAccessToken(tokens.access_token);
  return tokens;
};

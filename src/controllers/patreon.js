//Controller for managing behavior using ../modules/patreon.js
const { jsonError } = require("../modules/logging");

/* TODO: 
Done - User goes to profile and clicks on "link Patreon Account", 
Done - User is taken to page to approve linking account to remo, providing a redirect uri. 
Done - User is redirected back to remo.tv/patreon w/ code, state & uri from patreon auth. 
Done - code, and uri are retrieved from the clientside, then used to make a server side API call to get tokens
Current - tokens are saved to user in DB, and used to make api requests through patreon client
Not Done - need to find relevant methods / API Endpoints & add them to ../modules/patreon
*/

//Save Patron info needed to link remo user to user's patreon account

//Get relevant patron info

//Update patron info ( on change )
module.exports.linkPatron = async (code, uri, user) => {
  const {
    patreonGetTokens,
    getInfoFromAccessToken
  } = require("../modules/patreon");
  const tokenData = await patreonGetTokens(code, uri);
  console.log("//////////////PATREON GET TOKENS: ", tokenData);
  if (tokenData.access_token) {
    const savePatron = await this.savePatronLink(user, tokenData);
    console.log("SAVE PATRON RESULT: ", savePatron);
  }

  //Get Info!
  const info = await getInfoFromAccessToken(tokenData.access_token);
  console.log("/////////////GET INFO FROM ACCESS TOKENS: ", info);
  return info;
};

module.exports.savePatronLink = async (user, tokenData) => {
  const {
    savePatron,
    getPatron,
    patronUpdateToken
  } = require("../models/patreon");

  //check to see if patron exists:
  const check = await getPatron({ user_id: user.id });
  if (check) {
    console.log("Entry found for user: ", check.user_id);
    const updateToken = await patronUpdateToken({
      user_id: user.id,
      token_data: tokenData
    });
    return updateToken;

    //If no entry, make one!
  } else {
    //save Tokens
    const save = await savePatron({
      user_id: user.id,
      username: user.username,
      token_data: tokenData
    });
    return save;
  }
};

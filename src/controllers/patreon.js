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
  if (tokenData && tokenData.access_token) {
    const getPatronId = await getInfoFromAccessToken(tokenData.access_token);
    if (!getPatronId.error) {
      const saveLink = await this.savePatronLink(user, getPatronId);
      return saveLink;
    }
    return jsonError("Link Patron Error: Possible bad access token data");
  }
};

module.exports.savePatronLink = async (user, patronId) => {
  const {
    savePatron,
    getPatron,
    patronUpdateId,
    checkPatreonId
  } = require("../models/patreon");

  const checkPatron = await checkPatreonId(patronId); //check if patreon_id is in use
  const check = await getPatron({ user_id: user.id }); //check if user has already linked account

  //if patreon_id has already been linked to an existing account, return error
  if (
    (checkPatron && !check) ||
    (checkPatron && check && check.patreon_id !== patronId)
  )
    return jsonError("This patreon account is in use by another remo user");

  //Update patreon_id if account entry already exists
  if (check) {
    console.log("Entry found for user: ", check.user_id);
    if (check.patreon_id !== patronId) {
      const updateUser = await patronUpdateId({
        user_id: user.id,
        patreon_id: patronId
      });
      return updateUser;
    } else {
      return check;
    }
  } else {
    //save new link
    const save = await savePatron({
      user_id: user.id,
      username: user.username,
      patreon_id: patronId
    });
    return save;
  }
};

//Controller for managing behavior using ../modules/patreon.js
const { jsonError } = require("../modules/logging");

/**
 * Controller for managing Patreon Reward integration :
 * Input From: ../routes/api/integrations
 */

//Update patron info ( on change )
module.exports.linkPatron = async (code, uri, user) => {
  const {
    patreonGetTokens,
    getInfoFromAccessToken
  } = require("../modules/patreon");
  const tokenData = await patreonGetTokens(code, uri);
  // console.log("//////////////PATREON GET TOKENS: ", tokenData);
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
  if (check && check.error) return check.error;
  //if patreon_id has already been linked to an existing account, return error
  if (
    (checkPatron && !check) ||
    (checkPatron && check && check.patreon_id !== patronId)
  )
    return jsonError("This patreon account is in use by another remo user");

  //Update patreon_id if account entry already exists
  if (check) {
    // console.log("Entry found for user: ", check.user_id);
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

module.exports.removePatreon = async user_id => {
  const { removePatreonLink } = require("../models/patreon");
  const remove = await removePatreonLink(user_id);
  return remove;
};

/**
 * Get Pledge Data: Get & Sort data from Patreon Campaign
 * todo-1: Ensure Patron is actively contributing
 * todo-2: Handle Multiple Rewards ( Or check if that is even a thing )
 * todo-3: Determine which campaign goals Patron has contributed to
 * todo-4: Get total lifetime contribution of Patron
 */
module.exports.getPatreonData = async () => {
  const { getPledgeData } = require("../modules/patreon");
  try {
    const getData = await getPledgeData();
    if (getData && getData.data && getData.included) {
      const { data, included } = getData;
      // console.log("pledges: ", data.length, "included: ", included.length);
      const promises = await data.map(async item => {
        const { relationships } = item;
        if (relationships.reward.data && relationships.reward.data.id) {
          let pledge = {
            patreon_id: relationships.patron.data.id,
            reward_id: relationships.reward.data.id
          };

          included.map(item => {
            if (item.type === "reward" && item.id === pledge.reward_id) {
              pledge.reward_title = item.attributes.title;
              pledge.reward_amount = item.attributes.amount;
            }
          });
          await this.savePledgeData(pledge);
        }
      });
      await Promise.all(promises);
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * Save Pledge Data: Check if Patron has a linked account, save data accordingly
 */
module.exports.savePledgeData = async pledge => {
  const { checkPatreonId, updatePatronRewards } = require("../models/patreon");
  //TODO: Currently does not handle multiple rewards. Not sure if that is a thing.
  const data = {
    reward_title: pledge.reward_title,
    reward_id: pledge.reward_id,
    reward_amount: pledge.reward_amount
  };
  const checkForPatron = await checkPatreonId(pledge.patreon_id);
  if (checkForPatron) {
    const save = await updatePatronRewards(pledge.patreon_id, data);
    return save;
  }

  return null;
};

module.exports.syncPatreonData = async () => {
  await this.getPatreonData();
  checkInterval();
};

const checkInterval = async () => {
  const { createSimpleTimer } = require("../modules/utilities");
  const { patreonSyncInterval } = require("../config/server");
  await createSimpleTimer(patreonSyncInterval, this.syncPatreonData);
  return;
};

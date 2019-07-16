const { initDefaultInvites } = require("../models/invites");

const makeInvites = async () => {
  return await initDefaultInvites();
};

makeInvites();

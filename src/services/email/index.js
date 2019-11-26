const mail = require("@sendgrid/mail");
const { sendGrid } = require("../../config/server/index");
mail.setApiKey(sendGrid);
module.exports = mail;

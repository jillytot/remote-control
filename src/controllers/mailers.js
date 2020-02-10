//This is just a straight up link, will make it fancy later
const { reRouteOutboundEmail } = require("../config/server/index");
module.exports.emailResetKey = (user, { key_id }) => {
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config/server");
  const text = `${urlPrefix}recovery/${key_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: reRouteOutboundEmail || user.email,
    subject: "Remo.TV - Password Reset Token",
    text: text,
    html: html
  });
};

module.exports.emailValidationKey = (user, { key_id }) => {
  console.log(reRouteOutboundEmail);
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config/server");
  const text = `${urlPrefix}validate-email/${key_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: reRouteOutboundEmail || user.email,
    subject: "Remo.TV - Please validate your email address.",
    text: text,
    html: html
  });
};

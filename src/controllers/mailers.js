//This is just a straight up link, will make it fancy later

module.exports.emailResetKey = (user, { key_id }) => {
  const { reRouteOutboundEmail } = require("../config/server/index");
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
  const { reRouteOutboundEmail } = require("../config/server/index");
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

module.exports.emailLiveRobotAnnoucemnent = (
  user,
  { server_name, channel_id, robotAlert }
) => {
  const { reRouteOutboundEmail } = require("../config/server/index");
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config/server");
  const text = `${urlPrefix}${server_name}/${channel_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: reRouteOutboundEmail || user.email,
    subject: `Remo.TV - ${robotAlert}`,
    text: text,
    html: html
  });
};

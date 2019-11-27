module.exports.emailResetKey = (user, { key_id }) => {
  let { sendMail } = require("../services/email");
  const { urlPrefix } = require("../config/server");
  const text = `${urlPrefix}recovery/${key_id}`;
  const html = `<a href="${text}">${text}</a>`;
  sendMail({
    to: user.email,
    subject: "Remo.tv Password Reset Token",
    text: text,
    html: html
  });
};

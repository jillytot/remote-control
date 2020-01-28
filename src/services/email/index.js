const mail = require("@sendgrid/mail");
const { sendGrid, sendMail } = require("../../config/server/index");
mail.setApiKey(sendGrid);

module.exports.sendMail = async ({
  to = "",
  sender = sendMail,
  subject = "",
  text = "",
  html = ""
}) => {
  console.log("Sending Mail from: ", sendMail, "To: ", to, subject, text);
  mail.send({
    to: to,
    from: sender,
    subject: subject,
    text: text,
    html: html
  });
  return null;
};

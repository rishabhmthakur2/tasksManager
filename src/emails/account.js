const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (toEmail, name) => {
  sgMail.send({
    to: toEmail,
    from: 'thakur.rishabh@hotmail.com',
    subject: 'Thanks for joining us. We are happy to serve!',
    text: `Hi ${name}, \nWelcome to Easy Tasks. We are delighted to have you onboard. We are a team that thrives on its customer's feedback and look forward to hearing from you too.`
  });
};

const sendCancellationEmail = (toEmail, name) => {
  sgMail.send({
    to: toEmail,
    from: 'thakur.rishabh@hotmail.com',
    subject: 'We are sorry to see you go!',
    text: `Hi ${name}, \nWe are sorry to see you go. We request you to tell us what went wrong.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
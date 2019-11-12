
module.exports = (request)=>{
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: request.body.email,
  from: 'from_email@example.com',
  subject: 'Sending Email using Node.js with Sendgrid',
  text: 'That was easy!',
  html: 'Hi welcome to Aasaan IAS...You are registered successfullly to Aasaan IAS.!!',
};
sgMail.send(msg);
}


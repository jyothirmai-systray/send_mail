

//Node js 


module.exports = (request)=>{
const accountSid = 'AC967b4b86e1dfa16a177795b3ffec0fc8';
const authToken = 'f0795eb3ded9292d9a9c3e1b22d95b7f';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Hi welcome to Aasaan IAS...You are registered successfullly to Aasaan IAS.!!',
     from: '+12054987128',
     to: '+91'+request.body.phonenumber
   })
  .then(message => console.log(message.sid));}
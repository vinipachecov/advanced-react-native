const twilio = require('twilio');
const credentials = require('./credentials');

const accountSid = credentials.accountSid;
const authToken = credentials.authToken;

module.exports = new twilio.Twilio(accountSid,authToken);
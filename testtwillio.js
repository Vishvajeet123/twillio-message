require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

client.messages
  .create({
    body: "Hello from Twilio test script!",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+917505255495", 
  })
  .then((message) => console.log("Sent! SID:", message.sid))
  .catch((err) => console.error("Twilio error:", err.message));

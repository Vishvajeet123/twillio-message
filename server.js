const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();
const sendSMS = require('./twilio');

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json());

const CONTACTS_PATH = './contacts.json'
const MESSAGES_PATH ='./messages.json'


app.get('/api/contacts', (req, res) => {
  const data = fs.readFileSync(CONTACTS_PATH);
  res.json(JSON.parse(data));
});

app.get('/api/contacts/:id', (req, res) => {
  const contacts = JSON.parse(fs.readFileSync(CONTACTS_PATH));
  const contact = contacts.find(c => c.id === req.params.id);
  contact ? res.json(contact) : res.status(404).send('Not found');
});

app.post('/api/send', async (req, res) => {
  const { to, message, contactId } = req.body;

  try {
    await sendSMS(to, message);
    const log = {
      id: contactId,
      message,
      otp: message.match(/\d{6}/)[0],
      timestamp: new Date().toISOString()
    };
    const logs = JSON.parse(fs.readFileSync(MESSAGES_PATH));
    logs.unshift(log);
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(logs, null, 2));
    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'SMS sending failed', detail: err.message });
  }
});

app.get('/api/messages', (req, res) => {
  const logs = JSON.parse(fs.readFileSync(MESSAGES_PATH));
  res.json(logs);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

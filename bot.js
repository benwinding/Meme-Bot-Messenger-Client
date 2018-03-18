//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const hlpr = require('./helpers');
const prsr = require('./parsers/cmnds');
const urls = require('./parsers/path-parser');
const dpar = require('./parsers/dparsers');
const messenger = require('./repositories/messenger');
const path = require('path');

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// 522466234751069
// 521529374844755


// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    hlpr.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

app.use(express.static('public'));
// Display the web page
app.get('/', function(req, res) {
  res.send('index.html');
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  const data = req.body;
  hlpr.log("Data: " + data);
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      let pageID = entry.id;
      let timeOfEvent = entry.time;
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
  }
  res.sendStatus(200);
});

// Incoming events handling
function receivedMessage(event) {
  const senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  const message = event.message;

  hlpr.log(`Received message from user ${senderID}, with message: ${message.text}`);

  let messageId = message.mid;
  const messageText = message.text;
  let messageAttachments = message.attachments;
  
  const commandParsed = prsr.ParseCommand(messageText);
  
  if(prsr.IsTextRequest(commandParsed)) {
    dpar.GetTextFromCommand(commandParsed)
    .then((textMessage) => messenger.SendText(senderID, textMessage))    
    .then(() => IncrementCounter(commandParsed));
    return;
  }
  if(prsr.IsShareRequest(commandParsed)) {
    messenger.SendShareMe(senderID)   
    .then(() => IncrementCounter(commandParsed));
    return;
  }
  // Try send three times
  TrySendMeme(senderID, commandParsed)
  .catch(() => TrySendMeme(senderID, commandParsed))
  .catch(() => TrySendMeme(senderID, commandParsed))
  .catch(() => SendSafeMeme(senderID));
}

function TrySendMeme(senderID, commandRecieved){
  return new Promise((resolve,reject) => {
    dpar.GetImageFromCommand(commandRecieved)
    .then((Url) => {
      if(urls.IsVideo(Url)) {
        messenger.SendVideo(senderID, Url)
        .then(() => resolve(IncrementCounter(commandRecieved)))
        .catch((err) => {
          hlpr.log(`Error1: ${err}`);
          reject();
        });
      }
      else {
        messenger.SendImage(senderID, Url)
        .then(() => resolve(IncrementCounter(commandRecieved)))
        .catch((err) => {
          hlpr.log(`Error2: ${err}`);
          reject();
        });
      }
    })
    .catch((err) => {
      hlpr.log(`Error3: ${err}`);
      reject();
    });
  });
}

function SendSafeMeme(senderID) {
  hlpr.log(`Error: Things must have failed alot, Sending reliable image`);
  dpar.GetImageFromCommand("meme")
  .then((validUrl) => messenger.SendImage(senderID, validUrl))
  .then(() => {
    IncrementCounter("meme");
  })
}

//////////////////////////
// Statistics
/////////////////////////

function IncrementCounter(label) {
  hlpr.log('Incrementing counter: ' + label);
  const url = 'https://butter-goal.glitch.me/increment/' + label;
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
    })
    .then(() => {
      resolve(label);
    })
    .catch(reject);
  }) 

}

// Set Express to listen out for HTTP requests
const server = app.listen(process.env.PORT || 3000, function () {
  hlpr.log(`Listening on port ${server.address().port}`);
});

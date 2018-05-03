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
  if (data.object !== 'page') {
    console.log("Webhook unknown event not a page", event);
    res.sendStatus(501);
    return;
  }
  if (!data.entry) {
    console.log("Webhook unknown event no messages in request", event);
    res.sendStatus(500);
    return;
  }
  data.entry.forEach(function(entry) {
    if (!entry.messaging)
      return;
    entry.messaging.forEach(function(event) {
      const senderId = event.sender.id;
      const message = event.message;
      const postback = event.postback;
      if (message)
        handleMessageRecieved(senderId, message);
      else if(postback)
        handlePostBackRecieved(senderId, postback);
      else
        console.log("Webhook unknown event not a message or postback: ", event);
    });
  });
  res.sendStatus(200);
});

function handleMessageRecieved(senderId, message) {
  if(message.quick_reply)
    parseAndSend(senderId, message.quick_reply.payload);
  else if(message.text)
    parseAndSend(senderId, message.text);
  else
    parseAndSend(senderId, "meme");
}

function handlePostBackRecieved(senderId, postback) {
  if(postback.payload === 'GET_STORY_MENU')
    parseAndSend(senderId, "meme");
  else
    parseAndSend(senderId, postback.payload);
}

function parseAndSend(senderID, messageText) {
  const commandParsed = prsr.ParseCommand(messageText);

  if(prsr.IsTextRequest(commandParsed)) {
    dpar.GetTextFromCommand(commandParsed)
      .then((textMessage) => messenger.SendText(senderID, textMessage))
      .then(() => IncrementCounter(commandParsed));
    return;
  }
  // else if(prsr.IsShareRequest(commandParsed)) {
  //   messenger.SendShareMe(senderID)
  //     .then(() => IncrementCounter(commandParsed));
  //   return;
  // }
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

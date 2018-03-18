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

// Display the web page
app.get('/', function(req, res) {
  const messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<footer id=\"gWidget\"></footer><script src=\"https://widget.glitch.me/widget.min.js\"></script></body></html>";
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
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
        handleMessageRecieved(senderId, postback);
      else
        console.log("Webhook unknown event not a message or postback: ", event);
    });
  });
  res.sendStatus(200);
});

function handleMessageRecieved(senderID, messageText) {
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

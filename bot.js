//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const hlpr = require('./dependencies/helpers');
const messenger = require('./dependencies/messenger');
const prsr = require('./dparsers');

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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
  var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<footer id=\"gWidget\"></footer><script src=\"https://widget.glitch.me/widget.min.js\"></script></body></html>";
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  var data = req.body;
  hlpr.log("Data: " + data);
  if (data.object === 'page') {
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;
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
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  hlpr.log(`Received message from user ${senderID}, with message: ${message.text}`);

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var commandRecieved = "";
  
  prsr.ParseImageCommand(messageText)
  .then((command) => {
    commandRecieved = command;
    prsr.GetImageFromCommand(commandRecieved)
    .then((url) => prsr.ValidateUrl(url))
    .then((validatedUrl) => {
      if(prsr.IsVideo(validatedUrl)) {
        messenger.SendVideo(senderID, validatedUrl)
        .then(() => IncrementCounter(commandRecieved))
        .catch((err) => {
          hlpr.log(`Error1: ${err}, command: ${commandRecieved} didn't work, sending safe image`);
          SendSafeMeme(senderID);
        });
      }
      else {
        messenger.SendImage(senderID, validatedUrl)
        .then(() => IncrementCounter(commandRecieved))
        .catch((err) => {
          prsr.GetImageFromCommand(commandRecieved)
          .then((url) => prsr.ValidateUrl(url))
          .then((validatedUrl) => messenger.SendImage(senderID, validatedUrl))          
          .then(() => IncrementCounter(commandRecieved))
          .catch((err) => {
            hlpr.log(`Error2: ${err}, command: ${commandRecieved} didn't work, sending safe image`);
            SendSafeMeme(senderID);
          });
        });
      }
    })
    .catch((err) => {
      hlpr.log(`Error3: ${err}, command: ${commandRecieved} didn't work, sending safe image`);
      SendSafeMeme(senderID);
    });
  })
  .catch((err) => {
    prsr.GetTextFromCommand(messageText)
    .then((command) => messenger.SendText(senderID, command))
    .then(() => IncrementCounter("welcome"))
    .catch((err) => {
      hlpr.log(`Error4: ${err}, command: ${commandRecieved} didn't work, sending safe image`);
      SendSafeMeme(senderID);
    });
  });
}

function SendSafeMeme(senderID) {
  prsr.GetImageFromCommand("meme")
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
  var url = 'https://butter-goal.glitch.me/increment/' + label;
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
var server = app.listen(process.env.PORT || 3000, function () {
  hlpr.log(`Listening on port ${server.address().port}`);
});

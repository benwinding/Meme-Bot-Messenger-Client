//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const hlpr = require('./dependencies/helpers');
const messenger = require('./dependencies/messenger');
const reddit = require('./dependencies/reddit');
const imgur = require('./dependencies/imgur');

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
    console.log("Validating webhook");
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
  res.send(sendMeme)
});

// Message processing
app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
  }
  res.sendStatus(200);
});

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  hlpr.logMessage(`Received message from user ${senderID}, with message: ${message.text}`);

  var messageId = message.mid;
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    var messageTerms = messageText.split(' ');

    if(messageTerms.length == 1) {
      var firstTerm = messageTerms[0];
      if(hlpr.textMatches(firstTerm, "meme") ||
        hlpr.textMatches(firstTerm, ":)") ||
        hlpr.textMatches(firstTerm, "👍") ||
        hlpr.textMatches(firstTerm, "normal")) {
        incrementCounter("meme");
        sendMeme(senderID);
      } else if(hlpr.textMatches(messageText, "hot")) {
        incrementCounter("hot");
        sendMemeDank(senderID);
      } else if(hlpr.textMatches(messageText, "dank")) {
        incrementCounter("dank");
        reddit.sendDankReddit(senderID);
      } else if(hlpr.textMatches(firstTerm, "help")) { 
        incrementCounter("help");
        sendHelp(senderID); 
      } else if(hlpr.textMatches(firstTerm, "why")) {
        incrementCounter("why");
        sendWhy(senderID);
      } else if(hlpr.textMatches(firstTerm, "how")) {
        incrementCounter("how");
        sendHow(senderID);
      } else if(hlpr.textMatches(firstTerm, "random")) { 
        imgur.sendRandom(senderID);
        incrementCounter("random");
      } else {
        sendWelcome(senderID);
        incrementCounter("welcome");        
      }      
    }
    else {
      hlpr.removeString(messageTerms, "meme");
      if(hlpr.textMatches(messageText, "dank")) {
        incrementCounter("dank");
        sendMemeDank(senderID);        
      } else if(hlpr.textMatches(messageText, "find"))
      {
        hlpr.removeString(messageTerms, "find");
        var searchTerm = hlpr.getLongestString(messageTerms);
        incrementCounter("find");
        sendSearched(senderID, searchTerm);
      }
      else if(hlpr.textMatches(messageText, "search"))
      {
        hlpr.removeString(messageTerms, "search");
        var searchTerm = hlpr.getLongestString(messageTerms);
        incrementCounter("find");
        sendSearched(senderID, searchTerm);
      }
      else {
        incrementCounter("welcome");
        sendWelcome(senderID);
      }
    }
  }
  else {
    incrementCounter("meme");
    sendMeme(senderID);
  }
}

//////////////////////////
// Statistics
/////////////////////////

function incrementCounter(label) {
  hlpr.logMessage('Incrementing counter: ' + label);
  request({
    url: 'https://butter-goal.glitch.me/increment/' + label
  });
}

//////////////////////////
// Send Descriptions
//////////////////////////

function sendWhy(recipientId) {
  var sendMsg = `why the hell not mate?!`;
  messenger.sendTextWithCommands(recipientId, sendMsg);
}

function sendHow(recipientId) {
  var sendMsg = `
Here's how I work!
https://github.com/benwinding/Messenger-Meme-Bot

(Ben Winding 2017)
`;
  messenger.sendTextWithCommands(recipientId, sendMsg);
}

function sendHelp(recipientId) {
  var apiDesc = `( ͡° ͜ʖ ͡°) Below are my commands:
👍 or meme => random meme ;)
dank => dank meme
find blah => finds a meme related to blah
...
help => this...
why => ??
how => source code link
random => sends really random image

Careful, you could get anything with memebot...

(Ben Winding 2017)
  `;
  messenger.sendTextWithCommands(recipientId, apiDesc);
}

function sendWelcome(recipientId) {
  request({
      url: 'https://graph.facebook.com/v2.6/' + recipientId 
        + '?access_token=' + process.env.PAGE_ACCESS_TOKEN
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;
    
      var fbProfileBody = JSON.parse(body);
      var userName = fbProfileBody["first_name"];
      var greetings = ["Hey", "Howdy", "Hello", "G'day", "Bonjur", "Good Evening", "Good Morning", "Yo", "What's up"];
      var randomGreeting = hlpr.getRandomItemFromArray(greetings);
      var welcomeMsg = `${randomGreeting} ${userName}, 
I'm your personal Memebot™!
Try my buttons below!
¯\\_(ツ)_/¯
      `;
      messenger.sendTextWithCommands(recipientId, welcomeMsg);
    }
  );
}

//////////////////////////
// Meme senders
//////////////////////////

function sendMemeDank(recipientId) {
  var choice = hlpr.getRandomNumberBiased(1, 11);
  switch (choice) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      imgur.sendMemeFunctionSubReddit(recipientId, 'dankmemes', 'week', 2, 30); break;
    case 6:
    case 7:
    case 8:
      imgur.sendMemeFunctionSubReddit(recipientId, 'dankmemes', 'month', 5, 40); break;
    case 9:
    case 10:
      imgur.sendMemeFunctionSubReddit(recipientId, 'dankmemes', 'year', 10, 30); break;
    default:
      imgur.sendMemeFunctionSubReddit(recipientId, 'dankmemes', 'all', 10, 30); break;    
  }
}

function sendMeme(recipientId) {
  var choice = hlpr.getRandomNumberBiased(1, 12);
  switch(choice) {
    case 1: 
    case 2: 
    case 3: 
      sendMemeDay(recipientId); break;
    case 4: 
    case 5: 
    case 6: 
    case 7: 
      sendMemeWeek(recipientId); break;
    case 8: 
    case 9: 
    case 10: 
      sendMemeMonth(recipientId); break;
    case 11: 
      sendMemeYear(recipientId); break;
    default: 
      sendMemeAll(recipientId); break;
  }
}

function sendSearched(recipientId, searchTerm) {
  imgur.sendMemeSearched(recipientId, searchTerm);
}

function sendMemeDay(recipientId) {
  imgur.sendMemeFunction(recipientId, 'day', 0, 20);
}

function sendMemeWeek(recipientId) {
  imgur.sendMemeFunction(recipientId, 'week', 1, 50);
}

function sendMemeMonth(recipientId) {
  imgur.sendMemeFunction(recipientId, 'month', 3, 60);
}

function sendMemeYear(recipientId) {
  imgur.sendMemeFunction(recipientId, 'year', 4, 60);
}

function sendMemeAll(recipientId) {
  imgur.sendMemeFunction(recipientId, 'all', 3, 60);
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});

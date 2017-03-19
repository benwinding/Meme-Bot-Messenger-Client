//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<footer id=\"gWidget\"></footer><script src=\"https://widget.glitch.me/widget.min.js\"></script></body></html>";

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
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
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
    res.sendStatus(200);
  }
});

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message from user %d with message:", 
    senderID);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    if(textMatches(messageText, "meme test"))
      sendMemeTEST(senderID, messageText);
    else if(textMatches(messageText, "meme time"))
      sendTimeReminder(senderID);
    else if(textMatches(messageText, "meme day"))
      sendMemeDay(senderID);
    else if(textMatches(messageText, "meme week"))
      sendMemeWeek(senderID);
    else if(textMatches(messageText, "meme month"))
      sendMemeMonth(senderID);
    else if(textMatches(messageText, "meme year"))
      sendMemeYear(senderID);
    else if(textMatches(messageText, "meme all"))
      sendMemeAll(senderID);
    else if(textMatches(messageText, "dank"))
      sendMemeDank(senderID);
    else if(textMatches(messageText, "find "))
      sendSearched(senderID, messageText);
    else if(textMatches(messageText, "meme"))
      sendMeme(senderID);
    else if(textMatches(messageText, "help"))
      sendHelp(senderID);
    else if(textMatches(messageText, "why"))
      sendWhy(senderID);
    else if(textMatches(messageText, "how"))
      sendHow(senderID);
    else if(textMatches(messageText, "random"))
      sendRandom(senderID);
    else
      sendWelcome(senderID);
  }
  else
    sendMeme(senderID);
}

//////////////////////////
// Send Descriptions
//////////////////////////

function sendTimeReminder(recipientId) {
  var sendMsg = `Instead of typing:
meme time
 write
meme day
 or week,year,all,dank
`;
  sendTextMessage(recipientId, sendMsg);
}

function sendWhy(recipientId) {
  var sendMsg = `why the hell not mate?!`;
  sendTextMessage(recipientId, sendMsg);
}

function sendHow(recipientId) {
  var sendMsg = `
Here's how I work!
https://github.com/benwinding/Messenger-Meme-Bot

(Ben Winding 2017)
`;
  sendTextMessage(recipientId, sendMsg);
}

function sendHelp(recipientId) {
  var apiDesc = `( ͡° ͜ʖ ͡°) Below are my commands:
meme = random meme ;)
dank = dank meme
find ??? = finds a meme related to ???

help = this...
why = ??
how = source code link
random = sends really random image

Careful, you could get anything with memebot...

(Ben Winding 2017)
  `;
  sendTextMessage(recipientId, apiDesc);
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
      var randomGreeting = getRandomItemFromArray(greetings);
      var welcomeMsg = `${randomGreeting} ${userName}, 
I'm your personal memebot! 
type 'meme' and see what happens... 
¯\\_(ツ)_/¯ 
or 'help' for more details.
      `;
      sendTextMessage(recipientId, welcomeMsg);
    }
  );
}

//////////////////////////
// Meme senders
//////////////////////////

function sendMemeDank(recipientId) {
  sendMemeFunctionSubReddit(recipientId, 'dankmemes', 'week', 2, 40);
}

function sendMeme(recipientId) {
  sendMemeFunction(recipientId, 'month', 0, 30);
}

function sendSearched(recipientId, message) {
  var strings = message.split(' ');
  if(strings.length < 2) return;
  sendMemeSearched(recipientId, strings[1]);
}

function sendMemeDay(recipientId) {
  sendMemeFunction(recipientId, 'day', 0, 10);
}

function sendMemeWeek(recipientId) {
  sendMemeFunction(recipientId, 'month', 1, 50);
}

function sendMemeMonth(recipientId) {
  sendMemeFunction(recipientId, 'month', 3, 60);
}

function sendMemeYear(recipientId) {
  sendMemeFunction(recipientId, 'year', 4, 60);
}

function sendMemeAll(recipientId) {
  sendMemeFunction(recipientId, 'all', 3, 60);
}

function sendMemeFunction(recipientId, timePeriod, pageLast, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/t/dump/top/' + timePeriod + '/' + randomIntFromInterval(0,pageLast),
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var galleryResponse = JSON.parse(body);
      var firstBest = galleryResponse.data.items.slice(0,itemsLast);
      var randomGalleryItem = getRandomItemFromArray(firstBest);
      if(randomGalleryItem.is_album) {
         sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

function sendMemeFunctionSubReddit(recipientId, subReddit, timePeriod, pageLast, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/r/' + subReddit + '/top/' + timePeriod + '/' + randomIntFromInterval(0,pageLast),
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var galleryResponse = JSON.parse(body);
      var firstBest = galleryResponse.data.slice(0,itemsLast);
      var randomGalleryItem = getRandomItemFromArray(firstBest);
      if(randomGalleryItem.is_album) {
         sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

function sendMemeSearched(recipientId, searchMeme, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/search/top/0?q=meme%20' + searchMeme,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;
      var galleryResponse = JSON.parse(body);
      if(galleryResponse.data.length == 0) {
        sendTextMessage(recipientId, "No memes found :( try a different search word");
        return;
      }
      var firstBest = galleryResponse.data.slice(0,itemsLast);
      var randomGalleryItem = getRandomItemFromArray(firstBest);
      if(randomGalleryItem === undefined) {
        sendTextMessage(recipientId, "No memes found :( try a different search word");
        return;
      }
      if(randomGalleryItem.is_album) {
         sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

function sendMemeTEST(recipientId, message) {
  sendMemeSearched(recipientId, 'dog', 10);
}

function sendRandom(recipientId) {
  request({
      url: 'https://api.imgur.com/3/gallery/random/random/1/',
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var imgurApiResponse = JSON.parse(body);
      logObject(imgurApiResponse);
      var randomGalleryItem = getRandomItemFromArray(imgurApiResponse.data);
      if(randomGalleryItem.is_album) {
         sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

function sendRandomAlbumnImage(recipientId, id) {
  request({
      url: "http://api.imgur.com/3/gallery/album/" + id,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var imgurApiResponse = JSON.parse(body);
      var randomAblumnImage = getRandomItemFromArray(imgurApiResponse.data.images);
      logObject(randomAblumnImage);
      sendImage(recipientId, randomAblumnImage.link);
    }
  );
}

function sendImage(recipientId, imageUrl) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: { 
        type: "image",
        payload: {
          url: imageUrl
        }
      }
    }
  }
  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

//////////////////////////
// Generic helpers
//////////////////////////

function getRandomNumber(minimum, maxmimum) {
  return Math.floor(Math.exp(Math.random()*Math.log(maxmimum-minimum+1)))+minimum;
}

function randomIntFromInterval(min,max) {
  return getRandomNumber(min, max);
}

function textMatches(message, matchString) {
  return message.toLowerCase().indexOf(matchString) != -1;
}

function getRandomItemFromArray(items) {
  var random_item = items[getRandomNumber(0, items.length - 1)];
  return random_item;
}

function logObject(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});

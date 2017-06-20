const request = require('request');
const hlpr = require('./helpers');

//////////////////////////
// Messenger helpers
//////////////////////////

exports.sendImage = function sendImage(recipientId, imageUrl) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    "message":{
      attachment: { 
        type: "image",
        payload: {
          url: imageUrl
        }
      },
      "quick_replies": GetQuickReplies()
    }
  }
  hlpr.logMessage(`--Sending image with url: ${imageUrl}`);
  callSendAPI(messageData);
}

exports.sendTextWithCommands = function sendTextWithCommands(recipientId, messageText) {
  if(messageText == null || messageText == "")
    messageText = "";
  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      text: messageText,
      "quick_replies": GetQuickReplies()
    }
  }
  hlpr.logMessage(`--Sending message with text and quick_replies: ${messageText}`);
  callSendAPI(messageData);
}

/// Privates

function GetQuickReplies() {
  return [
    {
      "content_type":"text",
      "title":":)",
      "payload":"   ",
      "image_url":"http://i.imgur.com/vTstaG7.png"
    },
    {
      "content_type":"text",
      "title":"Hot",
      "payload":"   ",
      "image_url":"http://i.imgur.com/5jtndzY.png"
    },
    {
      "content_type":"text",
      "title":"Dank",
      "payload":"   ",
      "image_url":"http://i.imgur.com/nE9A8zX.png"
    },    
    {
      "content_type":"text",
      "title":"Help",
      "payload":"   ",
      "image_url":"http://i.imgur.com/mV7Diob.png"
    },
    {
      "content_type":"text",
      "title":"Random",
      "payload":"   ",
      "image_url":"http://i.imgur.com/HrdBnhZ.png"
    }    

  ]
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

      hlpr.logMessage(`Successfully sent generic message with id ${messageId} to recipient ${recipientId}`);      
      hlpr.logMessage(`Message Object ${JSON.stringify(body, null, 2)}`);      
    } else {
      hlpr.logMessage("Unable to send message");
      // sendMeme(recipientId);
      hlpr.logMessage(response);
      hlpr.logMessage(error);
    }
  });  
}

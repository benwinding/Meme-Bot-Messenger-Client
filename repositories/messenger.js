const hlpr = require('../helpers');
const rp = require('request-promise-native');

exports.SendImage = (recipientId, imageUrl) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl
        }
      },
      quick_replies: GetQuickReplies()
    }
  };
  return new Promise((resolve, reject) => {
    hlpr.log(`--Sending image with url: ${imageUrl}`);
    callSendAPI(messageData)
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject();
    })
  })
};

exports.SendShareMe = (recipientId) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload:{
          template_type:"generic",
          elements:[{
            title:"Share Memebot!",
            subtitle:"( ͡° ͜ʖ ͡°) Your friends need to see me",
            image_url:"https://i.imgur.com/KWl6pqT.jpg",
            item_url: "https://www.facebook.com/1memebot/",
            buttons:[{
              type:"element_share"
            }]
          }]
        }
      }
    }
  };
  
  return new Promise((resolve, reject) => {
    hlpr.log(`--Sending ShareMe!!`);
    callSendAPI(messageData)
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject();
    })
  })
};

exports.SendText = (recipientId, messageText) => {
  if(messageText == null || messageText == "")
    messageText = "";
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      "quick_replies": GetQuickReplies()
    }
  };
  return new Promise((resolve, reject) => {
    hlpr.log(`--Sending message with text and quick_replies: ${messageText}`);
    callSendAPI(messageData)
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject();
    })
  })
};

exports.SendVideo = (recipientId, imageUrl) => {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: imageUrl
        }
      },
      quick_replies: GetQuickReplies()
    }
  };
  return new Promise((resolve, reject) => {
    hlpr.log(`--Sending video with url: ${imageUrl}`);
    callSendAPI(messageData)
    .then(() => {
      resolve();
    })
    .catch(() => {
      reject();
    })
  })
};

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
      "title":"mild",
      "payload":"   ",
      "image_url":"http://i.imgur.com/HrdBnhZ.png"
    },
    {
      "content_type":"text",
      "title":"wild",
      "payload":"   ",
      "image_url":"http://i.imgur.com/M1k4gZi.png"
    },
    {
      "content_type":"text",
      "title":"MemEcon",
      "payload":"   ",
      "image_url":"http://i.imgur.com/hNVgPhM.png"
    },
    {
      "content_type":"text",
      "title":"share",
      "payload":"   ",
      "image_url":"https://cdn3.iconfinder.com/data/icons/glypho-free/64/share-128.png"
    }
  ]
}

function callSendAPI(messageData) {
  return new Promise((resolve, reject) => {
    const recipientId = getUserId(messageData.recipient.id);
    rp({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData
    })
    .then(() => {
      hlpr.log(`Successfully sent message to recipient ${recipientId}`); 
      resolve();
    })
    .catch(() => {
      hlpr.log(`Message failed to send to id: ${recipientId}`); 
      reject();
    });
  }) 
}

function getUserId(recipientId) {
  if(recipientId == 1300350910054687)
    return "BENNY";
  else
    return recipientId;
}

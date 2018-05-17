const hlpr = require('../shared/helpers');
const msgs = require('./static-messages');
const rp = require('request-promise-native');

function sendImage(recipientId, imageUrl) {
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
            quick_replies: msgs.GetQuickReplies()
        }
    };
    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending image with url: ${imageUrl}`);
        callSendAPI(messageData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                hlpr.err(`--Error sending image to messenger API`);
                reject();
            })
    })
}

function sendShareMe(recipientId) {
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
             "attachment":{
              "type":"template",
              "payload":{
                "template_type":"open_graph",
                "elements":[
                   {
                    "url":"https://www.example.com",
                    "buttons":[
                      {
                        "type":"web_url",
                        "url":"https://www.example.com",
                        "title":"View More"
                      }              
                    ]      
                  }
                ]
              }
            },
            quick_replies: msgs.GetQuickReplies()
        }
    };

    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending ShareMe!!`);
        callSendAPI(messageData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                hlpr.err(`--Error sending share to messenger API`);
                reject();
            })
    })
}

function sendPayMe(recipientId) {
    const messageData = {
        recipient: {
            id: recipientId
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title": "Donations Help",
                  "image_url":"https://i.imgur.com/drYGEoT.gif",
                  "buttons":[
                    {
                      "type":"web_url",
                      "url":"https://messenger-bot-test1.glitch.me/webview.html",
                      "title":"Donate Now"
                    }              
                  ]      
                }
              ]
            }
          },
          quick_replies: msgs.GetQuickReplies()
        }

    }

    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending PayMe!!`);
        callSendAPI(messageData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                hlpr.err(`--Error sending pay me to messenger API`);
                reject();
            })
    })
}

function sendText(recipientId, messageText) {
    if(messageText == null || messageText == "")
        messageText = "";
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText,
            quick_replies: msgs.GetQuickReplies()
        }
    };
    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending message with text and quick_replies: ${messageText}`);
        callSendAPI(messageData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                hlpr.err(`--Error sending text to messenger API`);
                reject();
            })
    })
}

function sendVideo(recipientId, imageUrl) {
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
            quick_replies: msgs.GetQuickReplies()
        }
    };
    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending video with url: ${imageUrl}`);
        callSendAPI(messageData)
            .then(() => {
                resolve();
            })
            .catch(() => {
                hlpr.err(`--Error sending video to messenger API`);
                reject();
            })
    })
}
/// Privates

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
            .catch((err) => {
                hlpr.err(`Message failed to send to id: ${recipientId}`, err);
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

module.exports = {
    SendImage: sendImage,
    SendShareMe: sendShareMe,
    SendText: sendText,
    SendVideo: sendVideo,
    SendPayMe: sendPayMe,
};
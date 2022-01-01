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
            .then(resolve)
            .catch((err) => reject(`--Error sending image to messenger API: ${JSON.stringify(err)}`));
    })
}

function sendShareMe(recipientId) {
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
                        title:"↑↑ Click to talk to Meme Bot!",
                        subtitle:"↓↓ Send Meme Bot to your friends!",
                        image_url:"https://i.imgur.com/RJSjTF6.jpg",
                        item_url: "https://m.me/1memebot",
                        buttons:[{
                            type:"element_share"
                        }]
                    }]
                }
            },
            quick_replies: msgs.GetQuickReplies()
        }
    };

    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending ShareMe!!`);
        callSendAPI(messageData)
            .then(resolve)
            .catch((err) => reject(`--Error sending share to messenger API: ${JSON.stringify(err)}`));
    })
}

function sendPayMe(recipientId) {
    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending PayMe!!`);
        getUser(recipientId)
            .then((user) => {
                let userName = user.first_name;
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
                                        "title": `Thanks ${userName}, your donation helps`,
                                        "image_url":"https://memebot.winding.app/button.jpg",
                                        "buttons":[
                                            {
                                                "type":"web_url",
                                                "url":"https://memebot.winding.app/donations/"+userName,
                                                "title":"Donate Now "+userName+"!",
                                                "webview_height_ratio": "tall",
                                                "messenger_extensions": "false",
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        quick_replies: msgs.GetQuickReplies()
                    }

                };
                callSendAPI(messageData)
                    .then(resolve)
                    .catch((err) => reject(`--Error sending pay me to messenger API: ${JSON.stringify(err)}`));
            })
    })
}

function sendIsTyping(recipientId, isTyping) {
    if(!isTyping)
        isTyping = false;
    const typingStr = isTyping? "typing_on" : "typing_off";
    const messageData = {
        recipient: {
            id: recipientId
        },
        sender_action: typingStr
    };
    return new Promise((resolve, reject) => {
        hlpr.log(`--Sending isTyping= ${isTyping}`);
        callSendAPI(messageData)
            .then(resolve)
            .catch((err) => reject(`--Error sending isTyping to messenger API: ${JSON.stringify(err)}`));
    })
}

function sendText(recipientId, messageText) {
    if(messageText == null || messageText === "")
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
            .then(resolve)
            .catch((err) => reject(`--Error sending text to messenger API: ${JSON.stringify(err)}`));
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
            .then(resolve)
            .catch((err) => reject(`--Error sending video to messenger API: ${JSON.stringify(err)}`));
    })
}

function getUser(recipientId) {
    return new Promise((resolve, reject) => {
        rp({
            uri: 'https://graph.facebook.com/v2.6/'+recipientId,
            qs: {
                fields: "first_name,last_name,profile_pic,locale,timezone,gender",
                access_token: process.env.PAGE_ACCESS_TOKEN
            },
            method: 'GET',
            json: true
        })
            .then(resolve)
            .catch((err) => {
                hlpr.err(`Message failed to getUser from id: ${recipientId}`, err);
                let blankUser = {
                    first_name: "Mr"
                };
                resolve(blankUser);
            });
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
            .then(resolve)
            .catch((err) => reject(`--Error : Message failed to send to id: ${recipientId}, err: ${JSON.stringify(err)}`));
    })
}

function getUserId(recipientId) {
    if(recipientId === 1300350910054687)
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
    SendIsTyping: sendIsTyping,
};
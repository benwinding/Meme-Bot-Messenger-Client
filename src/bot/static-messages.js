const hlpr = require('../shared/helpers');

//////////////////////////
// Send Descriptions
//////////////////////////

function GetWhy() {
    const sendMsg = `why the hell not mate?!`;
    return Promise.resolve(sendMsg);
}

function GetHow() {
    const sendMsg = `
Here's how I work!
https://github.com/benwinding/Messenger-Meme-Bot

(Ben Winding 2017)
`;
    return Promise.resolve(sendMsg);
}

function GetHelp() {
    const apiDesc = `( ͡° ͜ʖ ͡°) Below are my commands:
👍 or meme => random meme ;)
dank => dank meme
...
help => this...
why => ??
how => source code link
random => mildly interesting pic
help me => donations!!

Careful, you could get anything with memebot...

(Ben Winding 2017)
  `;
    return Promise.resolve(apiDesc);
}

function GetWelcome() {
    const greetings = ["Hey", "Howdy", "Hello", "G'day", "Bonjur", "Good Evening", "Good Morning", "Yo", "What's up"];
    const randomGreeting = hlpr.getRandomItemFromArray(greetings);
    const welcomeMsg = `${randomGreeting}, 
I'm your personal Memebot™!
Try my buttons below!
¯\\_(ツ)_/¯
  `;
    return Promise.resolve(welcomeMsg);
}

function GetQuickReplies() {
    return [
        {
            "content_type":"text",
            "title":":)",
            "payload":"MEME",
            "image_url":"http://i.imgur.com/vTstaG7.png"
        },
        {
            "content_type":"text",
            "title":"Hot",
            "payload":"HOT",
            "image_url":"http://i.imgur.com/5jtndzY.png"
        },
        {
            "content_type":"text",
            "title":"Dank",
            "payload":"DANK",
            "image_url":"http://i.imgur.com/nE9A8zX.png"
        },
        {
            "content_type":"text",
            "title":"MemEcon",
            "payload":"MEMECON",
            "image_url":"http://i.imgur.com/hNVgPhM.png"
        },
        {
            "content_type":"text",
            "title":"share me",
            "payload":"SHARE ME",
            "image_url":"https://i.imgur.com/rs0VIuC.png"
        },
        {
            "content_type":"text",
            "title":"Help",
            "payload":"HELP",
            "image_url":"http://i.imgur.com/mV7Diob.png"
        },
        {
            "content_type":"text",
            "title":"donate",
            "payload":"PAY ME",
            "image_url":"https://i.imgur.com/SGEnvkE.jpg"
        },
        {
            "content_type":"text",
            "title":"mild",
            "payload":"MILD",
            "image_url":"http://i.imgur.com/HrdBnhZ.png"
        },
        // {
        //     "content_type":"text",
        //     "title":"wild",
        //     "payload":"WILD",
        //     "image_url":"http://i.imgur.com/M1k4gZi.png"
        // },
    ]
}

module.exports = {
    GetWhy: GetWhy,
    GetHow: GetHow,
    GetHelp: GetHelp,
    GetWelcome: GetWelcome,
    GetQuickReplies: GetQuickReplies
};
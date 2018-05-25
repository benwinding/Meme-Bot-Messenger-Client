const rp = require('request-promise-native');
const urls = require('./parsers/url-parser');
const messenger = require('./messenger');
const msgs = require('./static-messages');
const meme = require('../memes/meme-fetcher');
const hlpr = require('../shared/helpers');

function handleMessageRecieved(senderId, message) {
    let input = "";
    if(message.quick_reply)
        input = message.quick_reply.payload;
    else if(message.text)
        input = message.text;
    else if(message.attachments)
        input = "meme";
    else
        input = "meme";

    parseAndSend(senderId, input);
}

function handlePostBackRecieved(senderId, postback) {
    let input = "";
    if(postback.payload === 'GET_STORY_MENU')
        input = "meme";
    else
        input = postback.payload;

    parseAndSend(senderId, input);
}

function parseAndSend(senderId, input) {
      if(!input)
        input = "";
      let inputLower = input.toLowerCase();
      switch(command) {
        case "meme":
            sendMeme(senderId, meme.GetMeme());
            break;
        case "dank":
            sendMeme(senderId, meme.GetImgurSubreddit("dankmemes"));
            break;
        case "hot":
            sendMeme(senderId, meme.GetHot());
            break;
        case "wild":
        case "xxx":
            sendMeme(senderId, meme.GetImgurSubreddit("SFWPornGifs"));
            break;
        case "mild":
        case "random":
            sendMeme(senderId, meme.GetImgurSubreddit("mildlyinteresting"));
            break;
        case "MemEcon":
        case "MemeEconomy":
        case "memecon":
            sendMeme(senderId, meme.GetImgurSubreddit("MemeEconomy"));
            break;
        case "fuck":
        case "fuck you":
        case "why":
            sendText(senderId, msgs.GetWhy());
            break;
        case "how":
            sendText(senderId, msgs.GetHow());
            break;
        case "share me":
        case "share":
            sendThis(senderId, messenger.SendShareMe(senderId));
            break;
        case "welcome":
        case "hey":
        case "yo":
        case "help":
        case "help me":
            sendText(senderId, msgs.GetHelp());
            break;
        case "pay me":
        case "donate":
            sendThis(senderId, messenger.SendPayMe(senderId));
            break;
        case "welcome":
            sendText(senderId, msgs.GetWelcome());
            break;
        default:
            sendText(senderId, msgs.GetWelcome());
            break;
    }
    incrementCommandCounter(command);
}

function sendMeme(senderId, getUrlPromise) {
    messenger.SendIsTyping(senderId, true)
      .then(() => getUrlPromise)
      .then((url) => {
        if(urls.IsVideo(url))
            return messenger.SendVideo(senderId, url);
        else
            return messenger.SendImage(senderId, url);
      })
      .then(() => messenger.SendIsTyping(senderId, false))
      .catch((err) => {
          hlpr.err('Error Bot.SendMeme: ', err);
          hlpr.log('Sending safe meme');
          sendSafeMeme(senderId);
      });
}

function sendText(senderId, getTextPromise) {
    messenger.SendIsTyping(senderId, true)
      .then(() => getTextPromise)
      .then((textMessage) => messenger.SendText(senderId, textMessage))
      .then(() => messenger.SendIsTyping(senderId, false))
      .catch((err) => {
          hlpr.err('Error Bot.SendText: ', err);
      });
}

function sendThis(senderId, sendPromise) {
    messenger.SendIsTyping(senderId, true)
      .then(() => sendPromise)
      .then(() => messenger.SendIsTyping(senderId, false))
      .catch((err) => {
          hlpr.err('Error Bot.SendThis: ', err);
      });
}

function sendSafeMeme(senderId) {
    sendThis(senderId, sendMeme(senderId, meme.GetMeme()));
}

function incrementCommandCounter(label) {
    hlpr.log('Incrementing counter: ' + label);
    const url = 'https://butter-goal.glitch.me/increment/' + label;
    return new Promise((resolve, reject) => {
        rp({
            uri: url,
        })
        .then(() => {
            resolve(label);
        })
        .catch((err) => {
            hlpr.err('Error Bot.incrementing stats counter: ', err);
            reject();
        });
    })
}

module.exports = {
    HandleMessageRecieved: handleMessageRecieved,
    HandlePostBackRecieved: handlePostBackRecieved
};
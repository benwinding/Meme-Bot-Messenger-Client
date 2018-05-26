const rp = require('request-promise-native');
const urls = require('./url-parser');
const msgs = require('./static-messages');
const messenger = require('./messenger');
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

let commands = [];
let defaultCommand;
function addCommand(command, aliases, callback, isdefault) {
    const newCommand = {
        name: command,
        aliases: aliases,
        action: callback,
    };
    commands.push(newCommand);
    if (isdefault)
        defaultCommand = newCommand;
}

addCommand("meme", ["good", "send memes", "memes", "meme"],
    (senderId) => sendMeme(senderId, meme.GetMeme()) );
addCommand("dank", ["lol"],
    (senderId) => sendMeme(senderId, meme.GetImgurSubreddit("dankmemes")) );
addCommand("hot", ["yas"],
    (senderId) => sendMeme(senderId, meme.GetHot()) );
addCommand("xxx", ["wild"],
    (senderId) => sendMeme(senderId, meme.GetImgurSubreddit("SFWPornGifs")) );
addCommand("mild", [],
    (senderId) => sendMeme(senderId, meme.GetImgurSubreddit("mildlyinteresting")) );
addCommand("random", [],
    (senderId) => sendMeme(senderId, meme.GetImgurSubreddit("mildlyinteresting")) );
addCommand("memecon", [ "memeeconomy",  "memeecon"],
    (senderId) => sendMeme(senderId, meme.GetImgurSubreddit("MemeEconomy")) );
addCommand("why", ["fuck", "fuck you"],
    (senderId) => sendText(senderId, msgs.GetWhy()) );
addCommand("how", ["wtf"],
    (senderId) => sendText(senderId, msgs.GetHow()) );
addCommand("share", ["share me"],
    (senderId) => sendThis(senderId, messenger.SendShareMe(senderId)) );
addCommand("help", ["help me"],
    (senderId) => sendText(senderId, msgs.GetHelp()) );
addCommand("donate", ["pay me"],
    (senderId) => sendThis(senderId, messenger.SendPayMe(senderId)) );
addCommand("welcome", [],
    (senderId) => sendText(senderId, msgs.GetWelcome()), true );

function parseAndSend(senderId, input) {
    if(!input)
        input = "";
    let inputCommand = input.toLowerCase();
    for (const command of commands) {
        if (command.name === inputCommand || command.aliases.includes(inputCommand)) {
            command.action(senderId);
            incrementCommandCounter(command.name);
            return;
        }
    }
    defaultCommand.action(senderId);
    incrementCommandCounter(defaultCommand.name);
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
            sendSafeMeme(senderId);
        });
}

function sendText(senderId, getTextPromise) {
    messenger.SendIsTyping(senderId, true)
        .then(() => getTextPromise)
        .then((textMessage) => messenger.SendText(senderId, textMessage))
        .then(() => messenger.SendIsTyping(senderId, false))
        .catch((err) => hlpr.err('Error Bot.SendText: ', err));
}

function sendThis(senderId, sendPromise) {
    messenger.SendIsTyping(senderId, true)
        .then(() => sendPromise)
        .then(() => messenger.SendIsTyping(senderId, false))
        .catch((err) => hlpr.err('Error Bot.SendThis: ', err));
}

function sendSafeMeme(senderId) {
    hlpr.log('Sending safe meme');
    sendThis(senderId, sendMeme(senderId, meme.GetMeme()));
}

function incrementCommandCounter(label) {
    hlpr.log('Incrementing counter: ' + label);
    const url = 'https://butter-goal.glitch.me/increment/' + label;
    return new Promise((resolve, reject) => {
        rp({
            uri: url,
        })
            .then(() => resolve(label))
            .catch((err) => {
                hlpr.err('Error Bot.incrementing stats counter: ', err);
                resolve();
            });
    })
}

module.exports = {
    HandleMessageRecieved: handleMessageRecieved,
    HandlePostBackRecieved: handlePostBackRecieved
};

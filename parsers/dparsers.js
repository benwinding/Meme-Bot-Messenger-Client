const imgur = require('../repositories/imgur');
const reddit = require('../repositories/reddit');
const msgs = require('../static/messages');
const hlpr = require('../helpers');
const cmds = require('./cmnds');
const meme = require('../meme-fetcher');

exports.GetImageFromCommand = (command) => {
  return new Promise((resolve, reject) => {
    switch(command) {
      case "meme":
        resolve(meme.GetMeme());break;
      case "dank":
        resolve(meme.GetImgurSubreddit("dankmemes"));break;
      case "hot":
        resolve(meme.GetHot());break;
      case "xxx":
        resolve(meme.getWild());break;
      case "random":
        resolve(meme.GetImgurSubreddit("mildlyinteresting"));break;
      case "memecon":
        resolve(meme.GetImgurSubreddit("MemeEconomy"));break;
      default:
        reject();
    }
  })
};

exports.GetTextFromCommand = (input) => {
  let inputLower = input;
  hlpr.log("Getting text from input command: " + inputLower);
  return new Promise((resolve, reject) => {
    switch(inputLower) {
      case "why":
        resolve(msgs.GetWhy());break;
      case "how":
        resolve(msgs.GetHow());break;
      case "welcome":
        resolve(msgs.GetWelcome());break;
      case "help":
        resolve(msgs.GetHelp());break;
      case "share":
        resolve(msgs.GetShareMe());break;
      default:
        resolve(msgs.GetWelcome());
    }
    reject();
  })
};


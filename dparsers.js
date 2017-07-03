const imgur = require('./dependencies/imgur');
const reddit = require('./dependencies/reddit');
const hlpr = require('./dependencies/helpers');
const cmds = require('./parsers/cmnds');
const meme = require('./meme-fetcher');

exports.GetImageFromCommand = (command) => {
  return new Promise((resolve, reject) => {
    switch(command) {
      case "meme":
        resolve(meme.GetMeme());break;
      case "dank":
        resolve(meme.GetImgurSubreddit("dankmemes"));break;
      case "hot":
        resolve(reddit.GetRedditSubReddit("dankmemes", "Feb 21 2016", 10));break;
      case "xxx":
        resolve(meme.getWild());break;
      case "random":
        resolve(meme.GetImgurSubreddit("mildlyinteresting"));break;
      default:
        reject();
    }
  })
}

exports.GetTextFromCommand = (input) => {
  let inputLower = input;
  hlpr.log("Getting text from input command: " + inputLower);
  return new Promise((resolve, reject) => {
    switch(inputLower) {
      case "why":
        resolve(GetWhy());break;
      case "how":
        resolve(GetHow());break;
      case "welcome":
        resolve(GetWelcome());break;
      case "help":
        resolve(GetHelp());break;
      default:
        resolve(GetWelcome());
    }
    reject();
  })
}

//////////////////////////
// Send Descriptions
//////////////////////////

function GetWhy() {
  var sendMsg = `why the hell not mate?!`;
  return Promise.resolve(sendMsg);
}

function GetHow() {
  var sendMsg = `
Here's how I work!
https://github.com/benwinding/Messenger-Meme-Bot

(Ben Winding 2017)
`;
  return Promise.resolve(sendMsg);
}

function GetHelp() {
  var apiDesc = `( ͡° ͜ʖ ͡°) Below are my commands:
👍 or meme => random meme ;)
dank => dank meme
...
help => this...
why => ??
how => source code link
random => mildly interesting pic

Careful, you could get anything with memebot...

(Ben Winding 2017)
  `;
  return Promise.resolve(apiDesc);
}

function GetWelcome() {
  var greetings = ["Hey", "Howdy", "Hello", "G'day", "Bonjur", "Good Evening", "Good Morning", "Yo", "What's up"];
  var randomGreeting = hlpr.getRandomItemFromArray(greetings);
  var welcomeMsg = `${randomGreeting}, 
I'm your personal Memebot™!
Try my buttons below!
¯\\_(ツ)_/¯
  `;
  return Promise.resolve(welcomeMsg);
}
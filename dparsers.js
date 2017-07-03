const rp = require('request-promise-native');
const imgur = require('./dependencies/imgur');
const reddit = require('./dependencies/reddit');
const hlpr = require('./dependencies/helpers');
const path = require('path');

exports.GetImageFromCommand = (command) => {
  return new Promise((resolve, reject) => {
    switch(command) {
      case "meme":
        resolve(exports.GetMeme());break;
      case "dank":
        resolve(exports.GetImgurSubreddit("dankmemes"));break;
      case "hot":
        resolve(reddit.GetRedditSubReddit("dankmemes", "Feb 21 2016", 10));break;
      case "xxx":
        resolve(getWild());break;
      case "random":
        resolve(exports.GetImgurSubreddit("mildlyinteresting"));break;
      default:
        reject();
    }
  })
}

exports.GetTextFromCommand = (input) => {
  let inputLower = input.toLowerCase();
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

exports.IsTextRequest = (input) => {
  let inputLower = input.toLowerCase();
  switch(inputLower) {
    case "why":
    case "how":
    case "welcome":
    case "help":
      hlpr.log("Command is text request");
      return true;
    default:
      hlpr.log("Command is image request");
      return false;
  }
}

exports.GetImgurSubreddit = (imgursubreddit) => {
  return new Promise((resolve, reject) => {
    var choice = hlpr.getRandomNumberBiased(1, 11);
    switch (choice) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        resolve(imgur.GetSubRedditImage(imgursubreddit, 'week', 2, 30));break;
      case 6:
      case 7:
      case 8:
        resolve(imgur.GetSubRedditImage(imgursubreddit, 'month', 5, 40));break;
      case 9:
      case 10:
        resolve(imgur.GetSubRedditImage(imgursubreddit, 'year', 10, 30));break;
      default:
        resolve(imgur.GetSubRedditImage(imgursubreddit, 'all', 10, 30));break;
    }
    reject();
  });
}

function getWild() {
  return new Promise((resolve, reject) => {
    var choice = hlpr.getRandomNumberBiased(1, 12);
    switch(choice) {
      case 1: 
      case 2: 
      case 3: 
        resolve(reddit.GetRedditSubReddit("SFWPornGifs", "Sep 17 2014", 50, "Feb 17 2016"));break;
      case 4: 
      case 5: 
      case 6: 
      case 7: 
      case 8: 
      case 9: 
      case 10: 
      case 11: 
      default: 
        resolve(reddit.GetRedditSubReddit("gonecivil", "Sep 17 2013", 80));break;
    }
    reject();
  })
}

exports.GetMeme = () => {
  return new Promise((resolve, reject) => {
    var choice = hlpr.getRandomNumberBiased(1, 12);
    switch(choice) {
      case 1: 
      case 2: 
      case 3: 
        resolve(imgur.GetMemeImage('day', 0, 20));break;
      case 4: 
      case 5: 
      case 6: 
      case 7: 
        resolve(imgur.GetMemeImage('week', 1, 50));break;
      case 8: 
      case 9: 
      case 10: 
        resolve(imgur.GetMemeImage('month', 3, 60));break;
      case 11: 
        resolve(imgur.GetMemeImage('year', 4, 60));break;
      default: 
        resolve(imgur.GetMemeImage('all', 3, 60));break;
    }
    reject();
  })
}

exports.ValidateUrl = (url) => {
  hlpr.log("validating url: " + url);
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'HEAD',
      uri: url
    };
    rp(options)
    .then(() => { 
      hlpr.log("valid url!")
      resolve(url) 
    })
    .catch((error) => {
      hlpr.log("Invalid url!");
      reject(error)
    });
  });
}

exports.ParseImageCommand = (input) => {
  var commandAliases = {
    "meme" : ["meme","normal",":)", "👍", "", null, undefined],
    "hot" : ["hot"],
    "dank" : ["dank"],
    "random" : ["random","mild"],
    "xxx" : ["xxx","wild"],
  }  
  if(input == undefined)
    input = "";
  let inputLower = input.toLowerCase();
  return new Promise((resolve, error) => {
    for(var command in commandAliases) {
      var aliases = commandAliases[command];
      for(var alias of aliases) {
        if(alias == inputLower) {
          hlpr.log("Command parsed: " + command);
          resolve(command);
        }
      }
    }
    error(input);
  })
}

exports.IsVideo = (url) => {
  var ext = path.extname(url);
  switch(ext) {
    case ".webm":
      return true;
    case ".gifv":
      return true;
    default:
      return false;
  }
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
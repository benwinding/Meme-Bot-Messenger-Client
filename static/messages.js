const hlpr = require('../helpers');

//////////////////////////
// Send Descriptions
//////////////////////////

exports.GetWhy = () => {
  var sendMsg = `why the hell not mate?!`;
  return Promise.resolve(sendMsg);
}

exports.GetHow = () => {
  var sendMsg = `
Here's how I work!
https://github.com/benwinding/Messenger-Meme-Bot

(Ben Winding 2017)
`;
  return Promise.resolve(sendMsg);
}

exports.GetHelp = () => {
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

exports.GetWelcome = () => {
  var greetings = ["Hey", "Howdy", "Hello", "G'day", "Bonjur", "Good Evening", "Good Morning", "Yo", "What's up"];
  var randomGreeting = hlpr.getRandomItemFromArray(greetings);
  var welcomeMsg = `${randomGreeting}, 
I'm your personal Memebot™!
Try my buttons below!
¯\\_(ツ)_/¯
  `;
  return Promise.resolve(welcomeMsg);
}
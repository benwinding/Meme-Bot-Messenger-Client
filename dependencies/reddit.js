const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`...`)).window;
var $ = require('jquery');

const hlpr = require('./helpers');
const messenger = require('./messenger');

//////////////////////////
// Reddit Helpers
//////////////////////////

exports.sendDankReddit = function sendDankReddit(recipientId) {
  let oldestDankMeme = new Date("Feb 21 2016").getTime()/1000;
  let todaysDate = Math.round(new Date().getTime()/1000.0);
  let timestamp_random = getRandomDateBetween(oldestDankMeme, todaysDate-400000);

  // let urlStart = '1476373923';
  // let urlEnd = '1476473923';
  let urlStart = parseInt(timestamp_random);
  let urlEnd = timestamp_random + 400000;
  let urlReddit = `https://www.reddit.com/r/dankmemes/search?q=(and%20timestamp%3A${urlStart}..${urlEnd})&restrict_sr=on&sort=top&syntax=cloudsearch`;
  hlpr.logMessage(`Sending reddit request: ${urlReddit}`);

  request({
      url: urlReddit,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    },
    function (error, response, body) {
      if (response.statusCode != 200) {
        hlpr.logMessage(`!!!!!!! error: ${error}`);
        hlpr.logMessage(`!!!!!!! status code: ${response.statusCode}`);
      }

      let doc = document.createElement('div');
      doc.innerHTML = body;

      let contents = doc.getElementsByClassName("contents").item(0);
      let randomResult = hlpr.getRandomItemFromArray(contents.children);
      let resultFooter = randomResult.getElementsByClassName('search-result-footer').item(0);
      let imageLink = resultFooter.getElementsByTagName('a').item(0);
      let imageUrl = imageLink.href;

      let imageFile = ParseImageFile(imageUrl);

      messenger.sendImage(recipientId, imageFile);
    }
  );
}

function getRandomDateBetween(dateStart, dateEnd) {
  var randomNum = hlpr.getRandomNumberEven(dateStart, dateEnd);
  return randomNum;
}

function ParseImageFile(imageUrl) {
  if(imageUrl.slice(-4)[0] != ".")
    return imageUrl + ".png";
  else
    return imageUrl;
}

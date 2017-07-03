const path = require('path');
const rp = require('request-promise-native');
const parse  = require('url-parse');
const cheerio = require('cheerio');
var $;

const hlpr = require('./helpers');

//////////////////////////
// Reddit Helpers
//////////////////////////

exports.GetRedditSubReddit = (subReddit, fromDate, daysGap) => {
  hlpr.log("Getting image from subreddit: " + subReddit);
  let utcGap = daysGap*24*60*60;

  let oldestDankMeme = new Date(fromDate).getTime()/1000;
  let todaysDate = Math.round(new Date().getTime()/1000.0) - utcGap;
  let timestamp_random = getRandomDateBetween(oldestDankMeme, todaysDate);
  return new Promise((resolve, reject) => {
    resolve(QuerySubReddit(subReddit, timestamp_random, utcGap));
  })
}

exports.GetRedditSubReddit = (subReddit, fromDate, daysGap, toDate) => {
  hlpr.log("Getting image from subreddit: " + subReddit);
  let utcGap = daysGap*24*60*60;

  let oldestDankMeme = new Date(fromDate).getTime()/1000;
  let todaysDate = new Date(fromDate).getTime()/1000 - utcGap;
  let timestamp_random = getRandomDateBetween(oldestDankMeme, todaysDate);
  return new Promise((resolve, reject) => {
    resolve(QuerySubReddit(subReddit, timestamp_random, utcGap));
  })
}

function QuerySubReddit(subReddit, timestamp_random, utcGap) {
  let urlStart = parseInt(timestamp_random);
  let urlEnd = timestamp_random + utcGap;
  let urlReddit = `https://www.reddit.com/r/${subReddit}/search?q=(and%20timestamp%3A${urlStart}..${urlEnd})&restrict_sr=on&sort=top&syntax=cloudsearch`;
  
  return new Promise((resolve, reject) => {
    hlpr.log("Url Requset: " + urlReddit);
    rp({
      url: urlReddit,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
      }
    })
    .then((body) => GetRandomImageFromResults(body))
    .then((url) => ParseImageFile(url))
    .then((urlParsed) => resolve(urlParsed))
    .catch((err) => {
      hlpr.log("!!! Error: " + err);
      hlpr.log("    Failed getting images from subreddit: " + subReddit);
      hlpr.log(`    from: ${hlpr.getDate(urlStart * 1000)} --- to: ${hlpr.getDate(urlEnd * 1000)}` );
      reject();
    });
  })
}

function GetRandomImageFromResults(body) {
  return new Promise((resolve, reject) => {
    $ = cheerio.load(body);
    let contents = $("div.contents").find('.search-result-footer')
      .find('a')
    if(contents == null || contents.length == 0) {
      hlpr.log("Reject: Couldn't get images from subreddit");
      reject();
    }
    else{
      let random = hlpr.getRandomItemFromArray(contents);
      let url = random.attribs.href;
      hlpr.log("Picking image: " + url);
      resolve(url);
    }
  })
}

function GetContentsFromBody(body) {
  return new Promise((resolve, reject) => {
    $ = cheerio.load(body);
    let contents = $("div.contents").find('.search-result-footer')
      .find('a')[0].innerText;
    if(contents.length > 0){
      resolve(contents.children(0));
    }
    else
      reject();
  })
}

function getRandomDateBetween(dateStart, dateEnd) {
  var randomNum = hlpr.getRandomNumberEven(dateStart, dateEnd);
  return randomNum;
}

function ParseImageFile(imageUrl) {
  let urlObj = new parse(imageUrl);
  var ext = path.extname(imageUrl);
  hlpr.log("Parsing image: " + imageUrl);
  return new Promise((resolve, reject) => {
    if(imageUrl == null) {
      reject();
    }
    else if(urlObj.hostname == "gfycat.com") {
      urlObj.set("hostname", "fat.gfycat.com");
      urlObj.set("pathname", urlObj.pathname + ".webm");
      resolve(urlObj.href);
    }
    else if(ext == ".gifv") {
      urlObj.set("pathname", urlObj.pathname.slice(0,-5) + ".gif");
      resolve(urlObj.href);
    }
    else
      resolve(urlObj.href);
    reject();
  })
}

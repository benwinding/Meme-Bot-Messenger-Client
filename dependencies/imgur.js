const request = require('request');

const hlpr = require('./helpers');
const messenger = require('./messenger');

//////////////////////////
// Imgur Helpers
//////////////////////////

exports.sendMemeFunction = function sendMemeFunction(recipientId, timePeriod, pageLast, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/t/dump/top/' + timePeriod + '/' + hlpr.getRandomNumberEven(0,pageLast),
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      hlpr.logMessage(`--Finding memes in 'dump' time: ${timePeriod}, pages:${pageLast}, numItems:${itemsLast}`);
      var galleryResponse = JSON.parse(body);
      hlpr.logMessage(`--Found: ${galleryResponse.data.items.length}, albumns or single images`);
      var firstBest = galleryResponse.data.items.slice(0,itemsLast);
      var randomGalleryItem = hlpr.getRandomItemFromArray(firstBest);
      if(randomGalleryItem.is_album) {
        exports.sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
        messenger.sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

exports.sendMemeFunctionSubReddit = function sendMemeFunctionSubReddit(recipientId, subReddit, timePeriod, pageLast, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/r/' + subReddit + '/top/' + timePeriod + '/' + hlpr.getRandomNumberEven(0,pageLast),
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      hlpr.logMessage(`--Finding memes in 'subreddit' subReddit:${subReddit}, time: ${timePeriod}, pages:${pageLast}, numItems:${itemsLast}`);
      var galleryResponse = JSON.parse(body);
      hlpr.logMessage(`--Found: ${galleryResponse.data.length}, albumns or single images`);
      var firstBest = galleryResponse.data.slice(0,itemsLast);
      var randomGalleryItem = hlpr.getRandomItemFromArray(firstBest);
      if(randomGalleryItem.is_album) {
         exports.sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         messenger.sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

exports.sendMemeSearched = function sendMemeSearched(recipientId, searchMeme, itemsLast)
{
  request({
      url: 'https://api.imgur.com/3/gallery/search/top/0?q=meme%20' + searchMeme,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      hlpr.logMessage(`--Searching for meme with keyword: ${searchMeme}`);
      if (error || response.statusCode != 200) return;
      var galleryResponse = JSON.parse(body);
      if(galleryResponse.data.length == 0) {
        messenger.sendTextWithCommands(recipientId, "No memes found :( try another");
        return;
      }
      hlpr.logMessage(`--Found: ${galleryResponse.data.length}, albumns or single images`);
      var firstBest = galleryResponse.data.slice(0,itemsLast);
      var randomGalleryItem = hlpr.getRandomItemFromArray(firstBest);
      if(randomGalleryItem === undefined) {
        messenger.sendTextWithCommands(recipientId, "No memes found :( try a different search word");
        return;
      }
      if(randomGalleryItem.is_album) {
         exports.sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         messenger.sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

//////////////////////////
// Imgur helpers
//////////////////////////

exports.sendRandom = function sendRandom(recipientId) {
  hlpr.logObjectDebug(process.env.IMG_CLIENT_ID);
  request({
      url: 'https://api.imgur.com/3/gallery/random/random/1/',
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }    
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var imgurApiResponse = JSON.parse(body);
      hlpr.logObjectDebug(imgurApiResponse);
      var randomGalleryItem = hlpr.getRandomItemFromArray(imgurApiResponse.data);
      if(randomGalleryItem.is_album) {
         exports.sendRandomAlbumnImage(recipientId, randomGalleryItem.id);
      }
      else {
         messenger.sendImage(recipientId, randomGalleryItem.link);
      }
    }
  );
}

exports.sendRandomAlbumnImage = function sendRandomAlbumnImage(recipientId, id) {
  request({
      url: "http://api.imgur.com/3/gallery/album/" + id,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    },
    function (error, response, body) {
      if (error || response.statusCode != 200) return;

      var imgurApiResponse = JSON.parse(body);
      hlpr.logMessage(`--Albumn selected with: ${imgurApiResponse.data.images.length} images, url: ${"https://imgur.com/gallery/" + id}`);
      var randomAblumnImage = hlpr.getRandomItemFromArray(imgurApiResponse.data.images);
      hlpr.logObjectDebug(randomAblumnImage);
      messenger.sendImage(recipientId, randomAblumnImage.link);
    }
  );
}


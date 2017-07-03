const rp = require('request-promise-native');

const hlpr = require('./helpers');

exports.GetRandomImage = function () {
  var url = 'https://api.imgur.com/3/gallery/random/random/1/';
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    })
    .then((body) => { 
      var parsed = JSON.parse(body); 
      GetImageFromResponse(parsed.data, 2)
      .then(resolve);
    })
    .catch(reject);
  }) 
}

exports.GetMemeImage = function (timePeriod, pageLast, itemsLast)
{
  var imgurPrefix = 'https://api.imgur.com/3/gallery/t/dump/top/';
  var url = imgurPrefix + timePeriod + '/' + hlpr.getRandomNumberEven(0,pageLast);
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    })
    .then((body) => { 
      var parsed = JSON.parse(body); 
      GetImageFromResponse(parsed.data.items, itemsLast)
      .then(resolve);
    })
    .catch(reject);
  }) 
}

exports.GetSubRedditImage = (subReddit, timePeriod, pageLast, itemsLast) => {
  var prefix = 'https://api.imgur.com/3/gallery/r/';
  var url = prefix + subReddit + '/top/' + timePeriod + '/' + hlpr.getRandomNumberEven(0,pageLast);
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    })
    .then((body) => { 
      var galleryResponse = JSON.parse(body);
      hlpr.log(`--Finding memes in 'subreddit' subReddit:${subReddit}, time: ${timePeriod}, pages:${pageLast}, numItems:${itemsLast}`);
      hlpr.log(`--Found: ${galleryResponse.data.length}, albumns or single images`);
      GetImageFromResponse(galleryResponse.data, itemsLast)
      .then(resolve);
    })
    .catch(reject);
  }) 
}

exports.sendMemeSearched = (recipientId, searchMeme, itemsLast) => {
  var url = 'https://api.imgur.com/3/gallery/search/top/0?q=meme%20' + searchMeme;
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    })
    .then((body) => { 
      var galleryResponse = JSON.parse(body);
      if(galleryResponse.data.length == 0)
        reject;
      GetImageFromResponse(galleryResponse.data, itemsLast)
      .then(resolve);
    })
    .catch(reject);
  }) 
}

function GetImageFromResponse(list, itemsLast) {
  return new Promise((resolve, reject) => {
    var firstBest = list.slice(0, itemsLast);
    var randomGalleryItem = hlpr.getRandomItemFromArray(firstBest);
    var imgUrl
    if(randomGalleryItem.is_album) {
      GetRandomAlbumnImage(randomGalleryItem.id)
      .then((url) => {resolve(url)})
      .catch(reject);              
    }
    else {
      resolve(randomGalleryItem.link);
    }
  })
}

function GetRandomAlbumnImage(id) {
  return new Promise((resolve, reject) => {
    rp({
      url: "https://api.imgur.com/3/gallery/album/" + id,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      }
    })
    .then((body) => {
      var imgurApiResponse = JSON.parse(body);
      var randomAblumnImage = hlpr.getRandomItemFromArray(imgurApiResponse.data.images);
      resolve(randomAblumnImage.link);
    })
    .catch(reject);
  })
}

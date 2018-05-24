const rp = require('request-promise-native');
const hlpr = require('../../shared/helpers');

function GetRandomImage() {
  const url = 'https://api.imgur.com/3/gallery/random/random/1/';
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      },
      json: true
    })
    .then((body) => {
      return GetImageFromResponse(body.data, 2);
    })
    .then(resolve)
    .catch(reject);
  })

}
function GetMemeImage(timePeriod, pageLast, itemsLast) {
  const imgurPrefix = 'https://api.imgur.com/3/gallery/t/dump/top/';
  const url = imgurPrefix + timePeriod + '/' + hlpr.getRandomNumberEven(0, pageLast);
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      },
      json: true
    })
    .then((body) => {
      return GetImageFromResponse(body.data.items, itemsLast);
    })
    .then(resolve)
    .catch(reject);
  })

}
const prefix = 'https://api.imgur.com/3/gallery/r/';
function GetSubRedditImage(subReddit, timePeriod, pageLast, itemsLast) {
  const url = prefix + subReddit + '/top/' + timePeriod + '/' + hlpr.getRandomNumberEven(0, pageLast);
  return new Promise((resolve, reject) => {
    rp({
      uri: url,
      headers: {
        'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID,
      },
      json: true
    })
    .then((body) => { 
      hlpr.log(`--Finding memes in 'subreddit' subReddit:${subReddit}, time: ${timePeriod}, pages:${pageLast}, numItems:${itemsLast}`);
      hlpr.log(`  Url: ${url}`);
      if(!body.data) {
        reject();
        return;
      }
      hlpr.log(`  Found: ${body.data.length}, albumns or single images`);
      if(body.data.length === 0) {
        hlpr.log(`  No images found? reponse =`, body);
      }
      return GetImageFromResponse(body.data, itemsLast)
        .then(resolve)
        .catch(reject);
    })
    .then(resolve)
    .catch(reject);
  })

}
module.exports = {
  GetRandomImage: GetRandomImage,
  GetMemeImage: GetMemeImage,
  GetSubRedditImage: GetSubRedditImage,
};

let done = false;

function GetImageFromResponse(list, itemsLast) {
  return new Promise((resolve, reject) => {
    const subList = list.slice(0, itemsLast);
    const randomGalleryItem = hlpr.getRandomItemFromArray(subList);
    let imgUrl;
    if(randomGalleryItem == null) {
      reject(`  gallery item == null`);
    }
    else if(randomGalleryItem.is_album) {
      let galleryId = randomGalleryItem.id;
      hlpr.log(`  Selected Album: ${galleryId}`);
      resolve(GetRandomAlbumnImage(galleryId));
    }
    else {
      hlpr.log(`  Selected Image: ${randomGalleryItem.link}`);
       resolve(randomGalleryItem.link);
    }
  })
}

function GetRandomAlbumnImage(id) {
  return new Promise((resolve, reject) => {
    let url = "https://api.imgur.com/3/gallery/album/" + id;
    rp({
      url: url,
      headers: {
          'Authorization': 'Client-ID ' + process.env.IMG_CLIENT_ID
      },
      json: true
    })
    .then((body) => {
      if(!body.data || !body.data.images) {
        reject('! bad response, url=' + url );
        return;
      }
      const randomAblumnImage = hlpr.getRandomItemFromArray(body.data.images);
      resolve(randomAblumnImage.link);
    })
    .catch((err) => {
      if(err.error)
        reject(err.error);
      else
        reject(err);
    });
  })
}

const imgur = require('./repositories/imgur');
const hlpr = require('../shared/helpers');

exports.GetHot = (imgursubreddit) => {
  return new Promise((resolve, reject) => {
    const choice = hlpr.getRandomNumberBiased(1, 11);
    switch (choice) {
      case 1:
      case 2:
      case 3:
      case 4:
        resolve(exports.GetImgurSubreddit("MemeEconomy"));break;
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      default:
        resolve(exports.GetImgurSubreddit("dankmemes"));break;
    }
    reject();
  });
};

exports.GetImgurSubreddit = (imgursubreddit) => {
  return new Promise((resolve, reject) => {
    const choice = hlpr.getRandomNumberBiased(1, 11);
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
};

exports.GetMeme = () => {
  return new Promise((resolve, reject) => {
    const choice = hlpr.getRandomNumberBiased(1, 12);
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
};
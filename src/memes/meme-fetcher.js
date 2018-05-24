const imgur = require('./repositories/imgur');
const hlpr = require('../shared/helpers');

function GetHot() {
  const choice = hlpr.getRandomNumberBiased(1, 11);
  switch (choice) {
    case 1:
    case 2:
    case 3:
    case 4:
      return GetImgurSubreddit("MemeEconomy");
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    default:
      return GetImgurSubreddit("dankmemes");
  }
}

function GetImgurSubreddit(imgursubreddit) {
  const choice = hlpr.getRandomNumberBiased(1, 11);
  switch (choice) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return imgur.GetSubRedditImage(imgursubreddit, 'week', 2, 30);
    case 6:
    case 7:
    case 8:
      return imgur.GetSubRedditImage(imgursubreddit, 'month', 5, 40);
    case 9:
    case 10:
      return imgur.GetSubRedditImage(imgursubreddit, 'year', 10, 30);
    default:
      return imgur.GetSubRedditImage(imgursubreddit, 'all', 10, 30);
  }
}

function GetMeme() {
  const choice = hlpr.getRandomNumberBiased(1, 12);
  switch(choice) {
    case 1:
    case 2:
    case 3:
      return imgur.GetMemeImage('day', 0, 20);
    case 4:
    case 5:
    case 6:
    case 7:
      return imgur.GetMemeImage('week', 0, 50);
    case 8:
    case 9:
    case 10:
      return imgur.GetMemeImage('month', 3, 60);
    case 11:
      return imgur.GetMemeImage('year', 4, 60);
    default:
      return imgur.GetMemeImage('all', 3, 60);
  }
}

module.exports = {
  GetHot: GetHot,
  GetImgurSubreddit: GetImgurSubreddit,
  GetMeme: GetMeme,
};
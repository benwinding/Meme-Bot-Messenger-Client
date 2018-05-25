const hlpr = require('../shared/helpers');
const path = require('path');
const rp = require('request-promise-native');

module.exports = {
  ValidateUrl: ValidateUrl,
  IsVideo: IsVideo,
}

function ValidateUrl(url) {
  hlpr.log("validating url: " + url);
  return new Promise(function (resolve, reject) {
    const options = {
      method: 'HEAD',
      uri: url
    };
    rp(options)
    .then(resolve(url))
    .catch((error) => reject("Invalid url!: " + JSON.stringify(error)));
  });
};

function IsVideo(url) {
  const ext = path.extname(url);
  switch(ext) {
    case ".webm":
      return true;
    case ".gifv":
      return true;
    default:
      return false;
  }
};
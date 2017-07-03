const hlpr = require('../dependencies/helpers');
const path = require('path');
const rp = require('request-promise-native');

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
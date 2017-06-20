const DEBUG = true;

//////////////////////////
// Generic helpers
//////////////////////////

exports.getRandomNumberBiased = function getRandomNumberBiased(minimum, maximum) {
  return Math.floor(Math.exp(Math.random()*Math.log(maximum-minimum+2)))+minimum-1;
}

exports.getRandomNumberEven = function getRandomNumberEven(minimum, maximum) {
  return Math.floor(Math.random()*(maximum+1 - minimum))+minimum;
}

exports.textMatches = function textMatches(message, matchString) {
  return message.toLowerCase().indexOf(matchString) != -1;
}

exports.getRandomItemFromArray = function getRandomItemFromArray(items) {
  var random_item = items[exports.getRandomNumberEven(0, items.length - 1)];
  return random_item;
}

exports.removeString = function removeString(strArray) {
  var index = strArray.indexOf(strArray);
  if(index != -1)
    strArray.splice(index, 1);
}

exports.getLongestString = function getLongestString(strArray) {
  return strArray.sort((a, b) => { return b.length - a.length; })[0];
}

exports.logObjectDebug = function logObjectDebug(obj) {
  if(DEBUG)
    console.log(JSON.stringify(obj, null, 2));
}

exports.logMessage = function logMessage(logMessage) {
  console.log(logMessage);
}
const DEBUG = true;

//////////////////////////
// Generic helpers
//////////////////////////

exports.getRandomNumberBiased = (minimum, maximum) => {
  return Math.floor(Math.exp(Math.random()*Math.log(maximum-minimum+2)))+minimum-1;
};

exports.getRandomNumberEven = (minimum, maximum) => {
  return Math.floor(Math.random()*(maximum+1 - minimum))+minimum;
};

exports.textMatches = (message, matchString) => {
  return message.toLowerCase().indexOf(matchString) != -1;
};

exports.getRandomItemFromArray = (items) => {
  const random_item = items[exports.getRandomNumberEven(0, items.length - 1)];
  return random_item;
};

exports.removeString = (strArray) => {
  const index = strArray.indexOf(strArray);
  if(index != -1)
    strArray.splice(index, 1);
};

exports.getLongestString = (strArray) => {
  return strArray.sort((a, b) => { return b.length - a.length; })[0];
};

exports.logObjectDebug = (obj) => {
  if(DEBUG)
    console.log(JSON.stringify(obj, null, 2));
};

exports.log = (logMessage) => {
  console.log(logMessage);
};

exports.getDate = (utcTime) => {
  let utcNum = Number(utcTime);
  let utc = new Date(utcNum);
  return utc.toDateString();
};


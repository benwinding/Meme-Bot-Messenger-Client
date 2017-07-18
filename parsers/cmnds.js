const hlpr = require('../helpers');
const path = require('path');

exports.IsTextRequest = (input) => {
  if(input == undefined)
    input = "";
  let inputLower = input.toLowerCase();
  switch(inputLower) {
    case "why":
    case "how":
    case "welcome":
    case "help":
      hlpr.log("Command is text request");
      return true;
    default:
      return false;
  }
}

exports.IsShareRequest = (input) => {
  if(input == undefined)
    input = "";
  let inputLower = input.toLowerCase();
  switch(inputLower) {
    case "share":
      hlpr.log("Command is share request");
      return true;
    default:
      hlpr.log("Command is probably image request");
      return false;
  }
}

exports.ParseCommand = (input) => {
  var commandAliases = {
    "meme" : ["meme","normal",":)", "👍", "", null, undefined],
    "hot" : ["hot"],
    "dank" : ["dank"],
    "random" : ["random","mild"],
    "xxx" : ["xxx","wild"],
    "why" : ["why"], 
    "how" : ["how"], 
    "welcome" : ["welcome"], 
    "help" : ["help"],
    "share" : ["share"],
  }  
  if(input == undefined)
    input = "";
  let inputLower = input.toLowerCase();
  for(var command in commandAliases) {
    var aliases = commandAliases[command];
    for(var alias of aliases) {
      if(alias == inputLower) {
        hlpr.log("Command parsed: " + command);
        return command;
      }
    }
  }
  return "meme";
}

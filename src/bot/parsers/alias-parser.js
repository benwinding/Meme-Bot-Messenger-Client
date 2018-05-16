const hlpr = require('../../shared/helpers');

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
};

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
};

const commandAliases = {
    "meme": ["meme", "normal", ":)", "👍", "", null, undefined],
    "hot": ["hot"],
    "dank": ["dank"],
    "random": ["random", "mild"],
    "xxx": ["xxx", "wild"],
    "why": ["why"],
    "how": ["how"],
    "welcome": ["welcome"],
    "help": ["help"],
    "share": ["share", "share me"],
    "memecon": ["memecon", "MemEcon", "MemeEconomy"],
};
exports.ParseCommand = (input) => {
  if(!input)
    input = "";
  let parsedCommand = "meme";
  let inputLower = input.toLowerCase();
  for(let currentCommand in commandAliases) {
    const aliases = commandAliases[currentCommand];
    for(let alias of aliases) {
      if(alias == inputLower) {
        parsedCommand = currentCommand;
      }
    }
  }
  hlpr.log(`--Input: '${input}' parsed to command: '${parsedCommand}'`);
  return parsedCommand;
};

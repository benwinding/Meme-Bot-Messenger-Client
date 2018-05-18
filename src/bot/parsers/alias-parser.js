const hlpr = require('../../shared/helpers');

const commandAliases = {
    "meme": ["meme", "normal", ":)", "👍", "", null, undefined],
    "hot": ["hot"],
    "dank": ["dank"],
    "random": ["random", "mild"],
    "xxx": ["xxx", "wild"],
    "why": ["why", "fuck", "fuck you"],
    "how": ["how"],
    "welcome": ["welcome"],
    "help": ["help"],
    "share": ["share", "share me"],
    "donate": ["donate", "pay me", "help me"],
    "memecon": ["memecon", "MemEcon", "MemeEconomy"],
};
exports.ParseCommand = (input) => {
  if(!input)
    input = "";
  let parsedCommand = "help";
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

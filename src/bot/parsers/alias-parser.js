const hlpr = require('../../shared/helpers');

const commandAliases = {
    "meme": "meme",
    "normal": "meme",
    "": "meme",
    "👍": "meme",

    "hot": "hot",

    "dank": "dank",

    "random": "random",

    "mild": "mild",

    "xxx": "xxx",

    "wild": "wild",

    "why": "why",
    "fuck": "why",
    "fuck you": "why",

    "how": "how",

    "welcome": "welcome",
    "hey": "welcome",
    "yo": "welcome",

    "help": "help",

    "share": "share",
    "share me": "share",

    "donate": "donate",
    "pay me": "donate",
    "help me": "donate",

    "memecon": "memecon",
    "MemEcon": "memecon",
    "MemeEconomy": "memecon",
};

exports.ParseCommand = (input) => {
  if(!input)
    input = "";
  let inputLower = input.toLowerCase();
  let parsedCommand = commandAliases[inputLower];
  if(!parsedCommand)
    parsedCommand = "welcome";
  hlpr.log(`--Input: '${input}' parsed to command: '${parsedCommand}'`);
  return parsedCommand;
};

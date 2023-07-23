const { bot } = require("./config/config");
const { userMap } = require("./Controllers/users");
const { HandleCommands } = require("./Controllers/DirectCommands");
const { isValidUSDTWallet } = require("./Helper");

const Languages = require("./Store/Languages");

function DetecteLanguage(msg) {
  switch (msg.from.language_code) {
    default:
      Languages.selectedLanguage = Languages.english;
      break;
    case "fr":
      console.log("LE FRANICS");
      Languages.selectedLanguage = Languages.french;
      break;
    case "ar":
      Languages.selectedLanguage = Languages.arabic;
      break;
    case "sp":
      Languages.selectedLanguage = Languages.spanish;
      break;
  }
}

bot.on("polling_error", (msg) => {
  DetecteLanguage(msg);
  console.log(msg.message);
});

bot.on("text", (msg) => {
  DetecteLanguage(msg);
if(msg.chat.type=='private'){
  if (msg.text.startsWith("/")) {
    HandleCommands(msg);
  }
}else{
  bot.sendMessage(msg.chat.id,'You can only speak to the bot in private.')
}
  console.log(msg);
  if (msg.from.is_bot) {
    console.log("Bot to bot speach is not allowed ");
    return;
  }

  
});

const config = require("../config/config");
const {
  VerifiyUser,
  userMap,
  VerifiyPayment,
  HandleUser,
  RequestJoinGroupe,
  RenewPlan,
} = require("./users");
const Languages = require("../Store/Languages");

async function HandleCommands(msgObj) {
  let Lang = Languages.selectedLanguage;
  const chat_id = msgObj.chat.id;

  try {
    switch (msgObj.text) {
      default:
        config.bot.sendMessage(
          chat_id,
          "unknown command , type /help to see command list"
        );
        break;
      case "/help":
        config.bot.sendMessage(chat_id, Lang.commands);
        break;

      case "/start":
        HandleUser(msgObj);
        break;
      case "/checkPay":
        VerifiyPayment(chat_id);
        break;
      case "/join":
        RequestJoinGroupe(chat_id);
        break;
      case "/renew":
        RenewPlan(msgObj);
        break;
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  HandleCommands,
};

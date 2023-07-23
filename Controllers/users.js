const { bot, db } = require("../config/config");
const helper = require("../Helper");
const Languages = require("../Store/Languages");
const userMap = new Map();
const {
  getUserById,
  addNewUser,
  updateColumnByUserId,
} = require("../Controllers/CRUD");
const {
  serverStatus,
  checkPayment,
  createPayment,
  paymentStatus,
} = require("../Controllers/Payment");
const config = require("../config/config");

const groupe = require("./groupe");

function CalculateDaysLeft(daysPassed, plan) {
  console.log(daysPassed);
  console.log(plan);
  switch (plan) {
    case 1:
      if (daysPassed < 30) {
        return 30 - daysPassed;
      } else {
        return 0;
      }
    case 3:
      if (daysPassed < 90) {
        return 90 - daysPassed;
      } else {
        return 0;
      }
    case 6:
      if (daysPassed < 180) {
        return 180 - daysPassed;
      } else {
        return 0;
      }
    case 12:
      if (daysPassed < 360) {
        return 360 - daysPassed;
      } else {
        return 0;
      }
    default:
      return 0;
  }
}
function GetPrice(Plan) {
  switch (Plan) {
    case 1:
      return config.groupeConfig.price1;

    case 3:
      return config.groupeConfig.price3;

    case 6:
      return config.groupeConfig.price6;

    case 12:
      return config.groupeConfig.price12;
  }
}
function VerifyUserStatus(dayzPassed, paimentStatus, plan) {
  let hasPaid = checkPayment(paimentStatus);
  switch (plan) {
    case 1:
      if (dayzPassed < 30 && hasPaid == "OK") {
        return true;
      } else {
        return false;
      }
    case 3:
      if (dayzPassed < 90 && hasPaid == "OK") {
        return true;
      } else {
        return false;
      }
    case 6:
      if (dayzPassed < 180 && hasPaid == "OK") {
        return true;
      } else {
        return false;
      }
    case 12:
      if (dayzPassed < 360 && hasPaid == "OK") {
        return true;
      } else {
        return false;
      }
  }
}

async function VerifiyUser(user_id) {
  const isUser = await getUserById(user_id);
  return isUser ? isUser : false;
}

async function HandleUser(msgObj) {
  let Lang = Languages.selectedLanguage;

  const user_id = msgObj.from.id;
  const isUser = await getUserById(user_id);
  if (isUser) {
    // Status is checkd based on if the user has
    // paid and if there are any days left for him

    let dayzPassed = helper.calculateRelativeDays(isUser.Sub_date);
    let UserpaymentStatus = await paymentStatus(isUser.paymentId);
    let planStatus = VerifyUserStatus(
      dayzPassed,
      UserpaymentStatus.payment_status,
      isUser.Sub_type
    );

    let daysLeft = CalculateDaysLeft(dayzPassed, isUser.Sub_type);

    switch (checkPayment(UserpaymentStatus.payment_status)) {
      case "OK":
        UserpaymentStatus = "Paid ✅";
        break;
      case "PROCCESING":
        UserpaymentStatus = "PROCCESING ⏳";
        break;
      case "WAITING":
        UserpaymentStatus = "Awaiting payment ⏳";
        break;
      case "PARTIAL":
        UserpaymentStatus = "Paritial payment ❌";
      case "failed":
        UserpaymentStatus = "Failed or expired ❌";
    }

    bot.sendMessage(
      user_id,
      `
      ✨ Welcome back, ${isUser.Username}! ✨
    ----------------------------------------
    📨 Plan   : ${isUser.Sub_type}  Month
    💸 Paid    : ${UserpaymentStatus} 
    ✅ Status    : ${planStatus ? "Active" : "Inactive"} 
    📆 Days left : ${daysLeft}
    ------------------------------------------  

  
    `
    );
    if (!planStatus) {
      if (groupe.isInGroupe(user_id)) {
        groupe.kickFromGroupe(user_id);
      }
      if (daysLeft == 0) {
        bot.sendMessage(user_id, Lang.signup.planDone);
      } else {
        VerifiyPayment(user_id);
      }
    }
  } else {
    bot.sendMessage(user_id, Lang.WelcomeMessage);
    bot.sendMessage(user_id, Lang.Newuser, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: Lang.buttons.signup,
              callback_data: "Signup",
            },
          ],
        ],

        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
async function VerifiyPayment(user_id) {
  let Lang = Languages.selectedLanguage;
 
  const isUser = await getUserById(user_id);

  if (isUser) {
    let UserpaymentStatus = await paymentStatus(isUser.paymentId);
    switch (checkPayment(UserpaymentStatus.payment_status)) {
      case "OK":
        UserpaymentStatus = "Paid ✅";
        break;
      case "PROCCESING":
        UserpaymentStatus = "PROCCESING ⏳";
        break;
      case "WAITING":
        UserpaymentStatus = "Awaiting payment ⏳";
        bot.sendMessage(user_id, Lang.paymentCheck.awaiting);
        bot.sendMessage(user_id, UserpaymentStatus.pay_address);
        break;
      case "PARTIAL":
        UserpaymentStatus = "Paritial payment ❌";
      case "failed":
        let price = GetPrice(isUser.Sub_type);
        let order_name = `${isUser.Sub_type} Months subscription`;
        let paymentData = await createPayment(
          order_name,
          price,
          "usdt",
          order_name
        );
        bot.sendMessage(user_id, Lang.paymentCheck.failed);
        UserpaymentStatus = "";

        updateColumnByUserId(user_id, "paymentId", paymentData.payment_id);
        bot.sendMessage(user_id, Lang.signup.paymentMessage);
        bot.sendMessage(
          user_id,
          ` 
💸 Amount to send (includes network fees) :

       ${paymentData.pay_amount}  USDT 
          
💲USDT TRC20 Address :

${paymentData.pay_address}
          
or you can scan the 📲QrCode 
          `
        );
        bot.sendPhoto(user_id, paymentData.qrCode);
    }
    {
      UserpaymentStatus && bot.sendMessage(user_id, UserpaymentStatus);
    }
  } else {
    HandleUser(msgObj);
  }
}

async function RequestJoinGroupe(user_id) {
  let Lang = Languages.selectedLanguage;
  

  let isUser = await VerifiyUser(user_id);

  if (isUser) {
    let dayzPassed = helper.calculateRelativeDays(isUser.Sub_date);
    let UserpaymentStatus = await paymentStatus(isUser.paymentId);
    let planStatus = VerifyUserStatus(
      dayzPassed,
      UserpaymentStatus.payment_status,
      isUser.Sub_type
    );
    let daysLeft = CalculateDaysLeft(dayzPassed, isUser.Sub_type);
    let isInGroupe = await groupe.isInGroupe(user_id)
    if (planStatus) {
      if (isInGroupe) {
        
        bot.sendMessage(user_id, Lang.signup.alreadyMembre);
        bot.sendMessage(user_id, Lang.support);
      } else {
        let invite_link = await groupe.createInviteLink();
        bot.sendMessage(user_id, Lang.signup.invite);
        bot.sendMessage(user_id, invite_link);
      }
    } else {
      if (daysLeft == 0) {
        bot.sendMessage(user_id, Lang.signup.planDone);
      } else {
        VerifiyPayment(user_id);
      }
    }
  } else {
    HandleUser(msgObj);
  }
}
async function RenewPlan(msgObj) {
  let user_id = msgObj.from.id;
  let Lang = Languages.selectedLanguage;
  let isUser = await VerifiyUser(user_id);
 
  if (isUser) {
    let dayzPassed = helper.calculateRelativeDays(isUser.Sub_date);
    let daysLeft = CalculateDaysLeft(dayzPassed, isUser.Sub_type);
    if(daysLeft >0){
        bot.sendMessage(user_id,Lang.signup.dayzLeft + daysLeft + Lang.signup.dayzLeft2)
    }else{
      bot.sendMessage(user_id, Lang.signup.packageType, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Lang.buttons.pack1,
                callback_data: "pack1",
              },
              {
                text: Lang.buttons.pack2,
                callback_data: "pack2",
              },
              {
                text: Lang.buttons.pack3,
                callback_data: "pack3",
              },
              {
                text: Lang.buttons.pack4,
                callback_data: "pack4",
              },
            ],
          ],
        },
      });
    }
    
  } else {
    HandleUser(user_id);
  }
}

bot.on("callback_query", async (callback) => {
  let Lang = Languages.selectedLanguage;

  const message = callback.message;
  const UserMessage = callback.from;

  const userId = UserMessage.id;
  const option = callback.data;
  const ChatID = message.chat.id;
  let isUser = await VerifiyUser(userId);
  // check to see if the current user is in memory
  // if not add them
  if (!userMap.has(userId)) {
    userMap.set(userId, {
      User_id: userId,
      Firstname: UserMessage.first_name,
      Username: UserMessage.username,
      Sub_date: Date.now(),
      packageType: 0,
      Status: "Pending",
      paymentId: "",
    });
  }
  const userData = userMap.get(userId);
  let price;
  console.log(userData);
  //helper.ClearMessages(ChatID, message.message_id);

  switch (option) {
    // First message
    case "Main":
      bot.sendMessage(ChatID, Lang.Newuser, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Lang.buttons.signup,
                callback_data: "Signup",
              },
            ],
          ],

          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      break;

    // SELECTING SUBSCRIPTION PACKAGE

    case "Signup":
      bot.sendMessage(ChatID, Lang.signup.packageType, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: Lang.buttons.pack1,
                callback_data: "pack1",
              },
              {
                text: Lang.buttons.pack2,
                callback_data: "pack2",
              },
              {
                text: Lang.buttons.pack3,
                callback_data: "pack3",
              },
              {
                text: Lang.buttons.pack4,
                callback_data: "pack4",
              },
            ],
          ],
        },
      });
      break;

    case "pack1":
      price = config.groupeConfig.price1;
      if (isUser) {
        if ((await serverStatus()) == "OK") {
          let order_name = `1 Months subscription`;
          let paymentData = await createPayment(
            order_name,
            price,
            config.adminProps.currency,
            order_name
          );
          updateColumnByUserId(userId, "paymentId", paymentData.payment_id);
          updateColumnByUserId(userId, "Sub_type", 1);
          updateColumnByUserId(userId, "Sub_date", Date.now());
          bot.sendMessage(ChatID, Lang.signup.paymentMessage);
          bot.sendMessage(
            ChatID,
            ` 
  💸 Amount to send (includes network fees) :
  
         ${paymentData.pay_amount}  USDT 
            
  💲USDT TRC20 Address :
  
  ${paymentData.pay_address}
            
  or you can scan the 📲QrCode 
            `
          );
          bot.sendPhoto(ChatID, paymentData.qrCode);
          bot.sendMessage(ChatID, Lang.signup.paymentConfirmation, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.confirm,
                    callback_data: "check",
                  },
                ],
              ],
            },
          });
        } else {
          bot.sendMessage(ChatID, "Somthing went wrong error 420.");
        }
      } else {
        userData.packageType = 1;
        bot.sendMessage(
          ChatID,
          `
      
        🧑 Firstname : ${userData.Firstname} 
        🧑 Username  : ${userData.Username} 
        📨 Plan      : ${userData.packageType} Month 
        💵 Price     : ${price}
      ` + Lang.signup.infoVerify,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.continue,
                    callback_data: "continue",
                  },
                  {
                    text: Lang.buttons.reject,
                    callback_data: "Main",
                  },
                ],
              ],
            },
          }
        );
      }
      break;
    case "pack2":
      price = config.groupeConfig.price3;
      if (isUser) {
        if ((await serverStatus()) == "OK") {
          let order_name = `3 Months subscription`;
          let paymentData = await createPayment(
            order_name,
            price,
            config.adminProps.currency,
            order_name
          );
          updateColumnByUserId(userId, "paymentId", paymentData.payment_id);
          updateColumnByUserId(userId, "Sub_type", 3);
          updateColumnByUserId(userId, "Sub_date", Date.now());
          bot.sendMessage(ChatID, Lang.signup.paymentMessage);
          bot.sendMessage(
            ChatID,
            ` 
  💸 Amount to send (includes network fees) :
  
         ${paymentData.pay_amount}  USDT 
            
  💲USDT TRC20 Address :
  
  ${paymentData.pay_address}
            
  or you can scan the 📲QrCode 
            `
          );
          bot.sendPhoto(ChatID, paymentData.qrCode);
          bot.sendMessage(ChatID, Lang.signup.paymentConfirmation, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.confirm,
                    callback_data: "check",
                  },
                ],
              ],
            },
          });
        }
      } else {
        userData.packageType = 3;
        bot.sendMessage(
          ChatID,
          `
            🧑 Firstname : ${userData.Firstname} 
            🧑 Username  : ${userData.Username ? userData.Username:'no username found'} 
            📨 Plan      : ${userData.packageType} Month 
            💵 Price     : ${price}
          ` + Lang.signup.infoVerify,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.continue,
                    callback_data: "continue",
                  },
                  {
                    text: Lang.buttons.reject,
                    callback_data: "Main",
                  },
                ],
              ],
            },
          }
        );
      }

      break;
    case "pack3":
      price = config.groupeConfig.price6;
      if (isUser) {
        if ((await serverStatus()) == "OK") {
          let order_name = `6 Months subscription`;
          let paymentData = await createPayment(
            order_name,
            price,
            config.adminProps.currency,
            order_name
          );
          updateColumnByUserId(userId, "paymentId", paymentData.payment_id);
          updateColumnByUserId(userId, "Sub_type", 6);
          updateColumnByUserId(userId, "Sub_date", Date.now());
          bot.sendMessage(ChatID, Lang.signup.paymentMessage);
          bot.sendMessage(
            ChatID,
            ` 
  💸 Amount to send (includes network fees) :
  
         ${paymentData.pay_amount}  USDT 
            
  💲USDT TRC20 Address :
  
  ${paymentData.pay_address}
            
  or you can scan the 📲QrCode 
            `
          );
          bot.sendPhoto(ChatID, paymentData.qrCode);
          bot.sendMessage(ChatID, Lang.signup.paymentConfirmation, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.confirm,
                    callback_data: "check",
                  },
                ],
              ],
            },
          });
        }
      } else {
        userData.packageType = 6;
        bot.sendMessage(
          ChatID,
          `
          🧑 Firstname : ${userData.Firstname} 
          🧑 Username  : ${userData.Username} 
          📨 Plan      : ${userData.packageType} Month 
          💵 Price     : ${price}
        ` + Lang.signup.infoVerify,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.continue,
                    callback_data: "continue",
                  },
                  {
                    text: Lang.buttons.reject,
                    callback_data: "Main",
                  },
                ],
              ],
            },
          }
        );
      }
      break;
    case "pack4":
      price = config.groupeConfig.price12;
      if (isUser) {
        if ((await serverStatus()) == "OK") {
          let order_name = `12 Months subscription`;
          let paymentData = await createPayment(
            order_name,
            price,
            config.adminProps.currency,
            order_name
          );
          updateColumnByUserId(userId, "paymentId", paymentData.payment_id);
          updateColumnByUserId(userId, "Sub_type", 12);
          updateColumnByUserId(userId, "Sub_date", Date.now());
          bot.sendMessage(ChatID, Lang.signup.paymentMessage);
          bot.sendMessage(
            ChatID,
            ` 
  💸 Amount to send (includes network fees) :
  
         ${paymentData.pay_amount}  USDT 
            
  💲USDT TRC20 Address :
  
  ${paymentData.pay_address}
            
  or you can scan the 📲QrCode 
            `
          );
          bot.sendPhoto(ChatID, paymentData.qrCode);
          bot.sendMessage(ChatID, Lang.signup.paymentConfirmation, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.confirm,
                    callback_data: "check",
                  },
                ],
              ],
            },
          });
        }
      } else {
        userData.packageType = 12;
        bot.sendMessage(
          ChatID,
          `
            🧑 Firstname : ${userData.Firstname} 
            🧑 Username  : ${userData.Username} 
            📨 Plan      : ${userData.packageType} Month 
            💵 Price     : ${price}
          ` + Lang.signup.infoVerify,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: Lang.buttons.continue,
                    callback_data: "continue",
                  },
                  {
                    text: Lang.buttons.reject,
                    callback_data: "Main",
                  },
                ],
              ],
            },
          }
        );
      }
      break;

    case "continue":
      if ((await serverStatus()) == "OK") {
        let price = GetPrice(userData.packageType);
        let order_name = `${userData.packageType} Months subscription`;
        let paymentData = await createPayment(
          order_name,
          price,
          "usdt",
          order_name
        );
        userData.paymentId = paymentData.payment_id;

        addNewUser(userData);
        bot.sendMessage(ChatID, Lang.signup.paymentMessage);
        bot.sendMessage(
          ChatID,
          ` 
💸 Amount to send (includes network fees) :

       ${paymentData.pay_amount}  USDT 
          
💲USDT TRC20 Address :

${paymentData.pay_address}
          
or you can scan the 📲QrCode 
          `
        );
        bot.sendPhoto(ChatID, paymentData.qrCode);
        bot.sendMessage(ChatID, Lang.signup.paymentConfirmation, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: Lang.buttons.confirm,
                  callback_data: "check",
                },
              ],
            ],
          },
        });
      } else {
        bot.sendMessage(ChatID, "Somthing went wrong error 420.");
      }

      break;
  
  case "check":
    RequestJoinGroupe(userId)
    break;
    }
});

module.exports = {
  VerifiyUser,
  userMap,
  VerifiyPayment,
  HandleUser,
  RequestJoinGroupe,
  RenewPlan,
};

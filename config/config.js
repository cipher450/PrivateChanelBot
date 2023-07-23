const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./config/database.db');

const dotnev = require('dotenv')
 
dotnev.config();
const token = process.env.TOKEN;
const nowPay = process.env.nowpay;
const bot = new TelegramBot(token,{polling:true});
const adminProps ={
    adminId:"1696347825",
    adminUsername:"ECHO994",
    SupportName:"@support",
    groupChatid1:"-1001852539977",
    groupChatid2:"-1q001852539977",
    currency:'usdt'
}
const groupeConfig ={
    groupeName1:'Royal signals VIP',
    price1:100,
    price3:200,
    price6:300,
    price12:500,
}
module.exports ={
    bot,
    db,
    nowPay,
    adminProps,
    groupeConfig
}
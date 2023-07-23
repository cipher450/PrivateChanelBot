const { bot, adminProps, groupeConfig } = require("../config/config");

module.exports = {
  createInviteLink: async () => {
    const currentTimestamp = Date.now();
    const futureTimestamp = currentTimestamp + 300 * 1000;
    var ops = {
      expire_date: futureTimestamp,
      member_limit: 1,
    };
    let inviteLink = await bot.createChatInviteLink(
      adminProps.groupChatid1,
      ops
    );
    return inviteLink.invite_link;
  },
  isInGroupe: async (userid) => {
    let userStatus = await bot.getChatMember(adminProps.groupChatid1, userid);
    console.log(userStatus)
    if (userStatus.status == "member") {
      return true;
    } else {
      return false;
    }
  },
  kickFromGroupe:async(userid)=>{
    try {
        await bot.banChatMember(adminProps.groupChatid1,userid)
    
    } catch (error) {
        
    }
  }
};

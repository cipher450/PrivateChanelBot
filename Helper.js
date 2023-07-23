const { bot } = require("./config/config");

function ClearMessages(chatID, messageID) {
  for (let i = 0; i < 20; i++) {
    bot.deleteMessage(chatID, messageID - i).catch((er) => {
      return;
    });
  }
}

 

function formatDate(nowdate) {
  const date = new Date(nowdate);

  // Extract the day, month, and year components from the Date object
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Note: Months are zero-based
  const year = date.getFullYear();

  // Create the formatted date string in "dd/mm/yyyy" format
  return `${day}/${month}/${year}`;
}
function calculateRelativeDays(creationDate) {
  
var now = new Date().getTime();


var diffrence = creationDate - now;
var getDays = function (timestamp) {
	// Convert to a positive integer
	var time = Math.abs(timestamp);
	// Define humanTime and units
	var humanTime;

	// If there are days
	 if (time > (1000 * 60 * 60 * 24) || time > (1000 * 60 * 60 * 24 * 30) || time > (1000 * 60 * 60 * 24 * 7)) {
	  return	humanTime = parseInt(time / (1000 * 60 * 60 * 24), 10);
		
	}else{
    return 0
  }

	

}
if(diffrence > 0){
  return 0
}else{
  return  getDays(diffrence)
}

}
module.exports = {
  ClearMessages, 
  formatDate,
  calculateRelativeDays,
};

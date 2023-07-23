const { bot, db } = require("../config/config");

module.exports = {
  getUserById: async (userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        `select * from users where  User_id = ?`,
        userId,
        function (err, row) {
          if (err) {
            reject(err.message);
          }
          resolve(row);
        }
      );
    });
  },
  addNewUser: async (userObj) => {
    const query = `INSERT INTO users (User_id, Firstname, Username, sub_date, Sub_type, Status,paymentId) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      userObj.User_id,
      userObj.Firstname,
      userObj.Username ? userObj.Username:'no username',
      userObj.Sub_date,
      userObj.packageType,
      userObj.Status,
      userObj.paymentId,
    ];
    return new Promise((resolve, reject) => {
      db.run(query, values, function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("user inserted ");
      });
    });
  },
  updateColumnByUserId: async (userId, columnToUpdate, newValue) => {
    const sql = `UPDATE users SET ${columnToUpdate} = ? WHERE User_id = ?`;
    return new Promise((resolve, reject) => {
      db.run(sql, [newValue, userId], function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log(
            `Column '${columnToUpdate}' updated for User_id ${userId}.`
          );
        }
      });
    });
    
  },
};

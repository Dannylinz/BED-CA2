// Naing Lin Htet 2329606 DISM/FT/2B/21
const pool = require('../services/db');

module.exports.addQuest = (data, callback) => {
  console.log('Received data:', data); // Log the data received in the request

  if (!data.quest_name || !data.quest_description || !data.level || !data.price || !data.created_by_username) {
      console.error('Missing required fields');
      callback(new Error('Missing required fields'));
      return;
  }

  const SQLSTATEMENT = `
      INSERT INTO Quest (quest_name, quest_description, level, price, status, created_by_username)
      VALUES (?, ?, ?, ?, 'available', ?);
  `;
  const VALUES = [data.quest_name, data.quest_description, data.level, data.price, data.created_by_username];
  console.log('Executing query:', SQLSTATEMENT, 'with values:', VALUES);

  pool.query(SQLSTATEMENT, VALUES, (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          callback(error);
      } else {
          console.log('Query results:', results);
          callback(null, results);
      }
  });
};
  
  module.exports.getAllQuests = (callback) => {
    const SQLSTATEMENT = `
      SELECT * FROM Quest;
    `;
  
    pool.query(SQLSTATEMENT, callback);
  };
  
  module.exports.completeQuest = (data, callback) => {
    const SQL_FETCH_QUEST = `
      SELECT level, price FROM Quest WHERE quest_id = ?;
    `;
    const SQL_FETCH_USER_LEVEL = `
      SELECT level FROM User WHERE user_id = ?;
    `;
    const SQL_UPDATE_USER_PRICE = `
      UPDATE User
      SET price = price + ?
      WHERE user_id = ?;
    `;
    const SQL_UPDATE_QUEST_STATUS = `
      UPDATE Quest
      SET status = 'completed', completed_by_username = ?
      WHERE quest_id = ?;
    `;
  
    console.log('Complete Quest Data:', data);
  
    // Fetch quest details
    pool.query(SQL_FETCH_QUEST, [data.quest_id], (fetchQuestError, fetchQuestResults) => {
      if (fetchQuestError) {
        console.error('Error fetching quest:', fetchQuestError);
        callback(fetchQuestError);
        return;
      }
  
      if (fetchQuestResults.length === 0) {
        console.error('Quest not found for ID:', data.quest_id);
        callback(new Error('Quest not found'));
        return;
      }
  
      const quest = fetchQuestResults[0];
      console.log('Fetched Quest:', quest);
  
      const rewardPoints = quest.price;
      const levelRequired = quest.level;
  
      // Fetch user's level
      pool.query(SQL_FETCH_USER_LEVEL, [data.user_id], (userLevelError, userLevelResults) => {
        if (userLevelError) {
          console.error('Error fetching user level:', userLevelError);
          callback(userLevelError);
          return;
        }
  
        if (userLevelResults.length === 0) {
          console.error('User not found for ID:', data.user_id);
          callback(new Error('User not found'));
          return;
        }
  
        const userLevel = userLevelResults[0]?.level;
        console.log('User Level:', userLevel);
  
        // Check if user's level is sufficient
        if (userLevel < levelRequired) {
          console.error('User level is insufficient. Required:', levelRequired, 'Actual:', userLevel);
          callback(new Error(`Your level is not sufficient to complete this quest. Level up more to do this quest. Required: ${levelRequired}, Actual: ${userLevel}`));
          return;
        }
  
        // Update user's price
        pool.query(SQL_UPDATE_USER_PRICE, [rewardPoints, data.user_id], (updateUserPriceError) => {
          if (updateUserPriceError) {
            console.error('Error updating user price:', updateUserPriceError);
            callback(updateUserPriceError);
            return;
          }
  
          console.log('Updated user price for user_id:', data.user_id, 'by rewardPoints:', rewardPoints);
  
          // Update quest status
          pool.query(SQL_UPDATE_QUEST_STATUS, [data.username, data.quest_id], (updateQuestError) => {
            if (updateQuestError) {
              console.error('Error updating quest status:', updateQuestError);
              callback(updateQuestError);
              return;
            }
  
            console.log('Quest status updated to completed for quest_id:', data.quest_id);
            callback(null);
          });
        });
      });
    });
  };
  
const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = "SELECT * FROM Task";

  pool.query(SQLSTATEMENT, callback);
};

//module.exports.insertSingle = (data, callback) => {
//  const SQLSTATEMENT =
//    "INSERT INTO Task (title, description, points, user_id) VALUES (?, ?, ?. ?)";
//  const VALUES = [data.title, data.description, data.points];
//  pool.query(SQLSTATEMENT, VALUES, callback);
//};

//module.exports.createNewTask = (data, callback) => {
//  const SQLSTATEMENT = `
//    INSERT INTO Task (title, description, points, user_id) VALUES (?, ?, ?, ?);
//  `;
//  const VALUES = [data.title, data.description, data.points, data.user_id]; // Include user_id in VALUES
//
//  pool.query(SQLSTATEMENT, VALUES, callback);
//};


//module.exports.selectById = (data, callback) => {
//  const SQLSTATEMENT = "SELECT * FROM Task WHERE task_id = ?";
//  const VALUES = [data.task_id];
//
//  pool.query(SQLSTATEMENT, VALUES, callback);
//};

//module.exports.updateById = (data, callback) => {
//  const SQLSTATEMENT = `
//    UPDATE Task SET title = ?, description = ?, points = ? WHERE task_id = ? AND user_id = ?; 
//  `;
//  const VALUES = [data.title, data.description, data.points, data.task_id, data.user_id];
//
//  pool.query(SQLSTATEMENT, VALUES, callback);
//};

//module.exports.deleteById = (data, callback) => {
//  const SQLSTATEMENT = `
//    DELETE FROM Task WHERE task_id = ? AND user_id = ?;
//    DELETE FROM TaskProgress WHERE task_id = ?;
//    ALTER TABLE Task AUTO_INCREMENT = 1;
//  `;
//  const VALUES = [data.task_id, data.user_id, data.task_id];
//
//  pool.query(SQLSTATEMENT, VALUES, callback);
//};

module.exports.completeTask = (data, callback) => {
  const SQL_FETCH_TASK_POINTS = `
    SELECT points FROM Task WHERE task_id = ?;
  `;
  const SQL_UPDATE_USER_POINTS = `
    UPDATE User
    SET points = points + ?
    WHERE user_id = ?;
  `;
  const SQL_INSERT_TASK_PROGRESS = `
    INSERT INTO TaskProgress (user_id, task_id, completion_date, notes)
    VALUES (?, ?, ?, ?);
  `;

  pool.query(SQL_FETCH_TASK_POINTS, [data.task_id], (fetchError, fetchResults) => {
    if (fetchError) {
      console.error("Error fetching task points:", fetchError);
      callback(fetchError);
    } else {
      const taskPoints = fetchResults[0]?.points || 0;
      console.log("Task points:", taskPoints);

      pool.query(SQL_INSERT_TASK_PROGRESS, [data.user_id, data.task_id, data.completion_date, data.notes], (insertError, insertResults) => {
        if (insertError) {
          console.error("Error inserting task progress:", insertError);
          callback(insertError);
        } else {
          pool.query(SQL_UPDATE_USER_POINTS, [taskPoints, data.user_id], (updateError, updateResults) => {
            if (updateError) {
              console.error("Error updating user points:", updateError);
              callback(updateError);
            } else {
              console.log("Points updated for user_id", data.user_id, ": affectedRows=", updateResults.affectedRows);

              // Fetch updated user points to confirm the update
              pool.query('SELECT points FROM User WHERE user_id = ?', [data.user_id], (fetchUpdatedError, fetchUpdatedResults) => {
                if (fetchUpdatedError) {
                  console.error("Error fetching updated user points:", fetchUpdatedError);
                  callback(fetchUpdatedError);
                } else {
                  console.log("Updated points for user_id", data.user_id, ":", fetchUpdatedResults[0]?.points);
                  callback(null, fetchUpdatedResults);
                }
              });
            }
          });
        }
      });
    }
  });
};
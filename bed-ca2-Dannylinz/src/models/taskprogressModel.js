const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = "SELECT * FROM TaskProgress";

  pool.query(SQLSTATEMENT, callback);
};

module.exports.checkid = (data, Callback) => {
  const SQLSTATEMENT = `
    SELECT * FROM task WHERE task_id = ?;
   
    `;
  const VALUES = [data.task_id];

  pool.query(SQLSTATEMENT, VALUES, Callback);
};

module.exports.createtaskprogress = (data, callback) => {
  const SQLSTATMENT = `
    INSERT INTO taskprogress (user_id, task_id,  notes)
    VALUES (?, ?, ?);
    SELECT * FROM taskprogress WHERE progress_id = LAST_INSERT_ID()
    `; // SELECT * ... --> to retrieve the record of the last inserted user from the User table immediately after performing an INSERT operation
  const VALUES = [data.user_id, data.task_id, data.notes];

  pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = "SELECT * FROM TaskProgress WHERE progress_id = ?";
  const VALUES = [data.progress_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateById = (data, callback) => {
  const SQLSTATEMENT = `
    UPDATE TaskProgress 
    SET notes = ? 
    WHERE progress_id = ?;
    SELECT progress_id, user_id, task_id, completion_date, notes 
    FROM TaskProgress 
    WHERE progress_id = ?;
  `;
  const VALUES = [data.notes, data.progress_id, data.progress_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM TaskProgress WHERE progress_id = ?;
     ALTER TABLE TaskProgress AUTO_INCREMENT = 1;
     `;
  const VALUES = [data.progress_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectByuserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT TaskProgress.*, Task.title, Task.description, Task.points
    FROM TaskProgress
    JOIN Task ON TaskProgress.task_id = Task.task_id
    WHERE TaskProgress.user_id = ?;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
//const SQLSTATMENT = `
//  SELECT task_id, completion_date, notes 
//  FROM taskprogress 
//  WHERE user_id = ?`;

//const VALUES = [user_id];

//pool.query(SQLSTATMENT, VALUES, callback);
//}
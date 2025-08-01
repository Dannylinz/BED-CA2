//Naing Lin Htet 2329606 DISM/FT/2B/21
//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require("../services/db");

module.exports.selectAll = (callback) => {
  const SQLSTATEMENT = `
  SELECT * FROM User;
      `;
  pool.query(SQLSTATEMENT, callback);
};

module.exports.selectById = (data, callback) => {
  const SQLSTATEMENT = `
      
  SELECT User.id, User.username, User.email, User.created_on, User.updated_on, User.last_login_on FROM User WHERE id = ?;
      `;
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};
//SELECT User.id, User.username, User.email, User.created_on, User.updated_on, User.last_login_on FROM User WHERE id = ?;
module.exports.insertSingle = (data, callback) => {
  const SQLSTATEMENT = `
      INSERT INTO User (username, email, password) 
      VALUES (?, ?, ?);
      `;
  const VALUES = [data.username, data.email, data.password];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateLastLogin = (id, callback) => {
  const SQLSTATEMENTS = `
    UPDATE user SET last_login_on = CURRENT_TIMESTAMP WHERE id = ?;
  `;
  pool.query(SQLSTATEMENTS, id, callback);
};
module.exports.selectByNameOrEmail = (data, callback) => {
  const SQLSTATEMENTS = `
    SELECT * FROM user WHERE username = ? OR email = ?;
    `;
  const VALUES = [data.username, data.email];
  pool.query(SQLSTATEMENTS, VALUES, callback);
};
module.exports.updateUserById = (data, callback) => {
  const SQLSTATEMENT = `
       UPDATE User SET username = ?, email = ?, password = ? WHERE id = ?; 
    `;
  const VALUES = [data.username, data.email, data.password, data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) => {
  const SQLSTATEMENT = `
    DELETE FROM User WHERE id = ?;
     ALTER TABLE User AUTO_INCREMENT = 1;
     `;
  const VALUES = [data.id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};



module.exports.selectByUserId = (data, callback) => {
  const SQLSTATEMENT = `
    SELECT user_id, player_name, gender 
    FROM User 
    WHERE user_id = ?;
  `;
  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectByUsername = (data, callback) => {
  const SQLSTATMENT = `
      SELECT
          user_id,
          username,
          password
      FROM
          User
      WHERE
          username = ?;
  `;

  const VALUES = [data.username];

  pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.getUserById = (data, callback) => {
  const SQLSTATEMENT = `
  SELECT username, user_id, email, created_on, points, price, level
  FROM User 
  WHERE user_id = ?`;

  const VALUES = [data.user_id];

  pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectByUsernameOrEmail = (data, callback) => {
  const SQLSTATMENT = `
      SELECT
          user_id
      FROM
          User
      WHERE
          username = ?
          OR
          email = ?;
  `;

  const VALUES = [data.username, data.email];

  pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.levelUpUser = (data, callback) => {
  const SQL_UPDATE_USER_LEVEL = `
    UPDATE User
    SET level = level + 1, points = points - ?
    WHERE user_id = ?;
  `;
  const VALUES = [data.pointsToDeduct, data.user_id];

  pool.query(SQL_UPDATE_USER_LEVEL, VALUES, callback);
};

module.exports.getUserInventory = (userId, callback) => {
  const SQLSTATEMENT = `
      SELECT i.item_name, i.item_type, i.item_description, i.price, ui.purchase_date
      FROM UserItems ui
      JOIN Items i ON ui.item_id = i.item_id
      WHERE ui.user_id = ?`;

  pool.query(SQLSTATEMENT, [userId], callback);
};


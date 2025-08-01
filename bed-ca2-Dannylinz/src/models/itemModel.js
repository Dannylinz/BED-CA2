
const pool = require('../services/db');

module.exports.getAllItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT item_id, item_name, item_type, item_description, price, level 
        FROM Items 
        ORDER BY level ASC, item_name ASC`;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.insertItem = (data, callback) => {
    const SQL_STATEMENT = `
        INSERT INTO items (item_name, item_type, item_description, price, level)
        VALUES (?, ?, ?, ?, ?)
    `;
    const VALUES = [data.item_name, data.item_type, data.item_description, data.price, data.level];
    
    pool.query(SQL_STATEMENT, VALUES, callback);
};

module.exports.getItemById = (item_id, callback) => {
    const SQLSTATEMENT = `
        SELECT item_id, item_name, item_type, item_description, price, level
        FROM Items 
        WHERE item_id = ?`;

    const VALUES = [item_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getUserBalance = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT price 
        FROM User 
        WHERE user_id = ?`;

    const VALUES = [user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.recordPurchase = (user_id, item_id, item_price, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserItems (user_id, item_id) 
        VALUES (?, ?)`;

    const VALUES = [user_id, item_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.updateUserBalance = (user_id, item_price, callback) => {
    const SQLSTATEMENT = `
        UPDATE User 
        SET price = price - ? 
        WHERE user_id = ?`;

    const VALUES = [item_price, user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getUserLevel = (user_id, callback) => {
    const SQLSTATEMENT = `
        SELECT level
        FROM User
        WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [user_id], callback);
  };
const pool = require('../services/db');

module.exports.getAllMessages = (callback) => {
    const query = `
        SELECT * FROM Messages;
    `;
    console.log('Executing query:', query);
    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};
module.exports.createMessage = (data, callback) => {
    const query = `
        INSERT INTO Messages (user_id, username, message_text)
        VALUES (?, ?, ?);
    `;
    console.log('Executing query:', query, 'with data:', data);
    pool.query(query, [data.user_id, data.username, data.message_text], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};

module.exports.updateMessage = (id, data, callback) => {
    const query = `
        UPDATE Messages
        SET message_text = ?
        WHERE id = ?;
    `;
    console.log('Executing query:', query, 'with id:', id, 'and data:', data);
    pool.query(query, [data.message_text, id], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};

module.exports.deleteMessageById = (messageId, callback) => {
    const SQLSTATEMENT = `DELETE FROM Messages WHERE id = ?`;
    const VALUES = [messageId];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
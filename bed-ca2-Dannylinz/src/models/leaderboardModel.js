const pool = require('../services/db'); // Adjust path as necessary

module.exports.getLeaderboard = (callback) => {
    const SQLSTATEMENT = `
        SELECT username, points, price, level
        FROM User
        ORDER BY points DESC, price DESC, level DESC
        LIMIT 10;
    `;

    pool.query(SQLSTATEMENT, callback);
};
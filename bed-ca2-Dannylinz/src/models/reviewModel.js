const pool = require('../services/db');

module.exports.getAllReviews = (callback) => {
    const query = 'SELECT * FROM Reviews';
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

module.exports.createReview = (data, callback) => {
    const query = `
        INSERT INTO Reviews (user_id, username, rating, review_text)
        VALUES (?, ?, ?, ?);
    `;
    console.log('Executing query:', query, 'with data:', data);
    pool.query(query, [data.user_id, data.username, data.rating, data.review_text], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};

module.exports.updateReview = (id, data, callback) => {
    const query = `
        UPDATE Reviews
        SET review_text = ?, rating = ?
        WHERE id = ?;
    `;
    console.log('Executing query:', query, 'with id:', id, 'and data:', data);
    pool.query(query, [data.review_text, data.rating, id], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};

module.exports.deleteReviewById = (reviewId, callback) => {
    const query = `DELETE FROM Reviews WHERE id = ?`;
    const values = [reviewId];
    console.log('Executing query:', query, 'with values:', values);
    pool.query(query, values, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
        } else {
            console.log('Query results:', results);
        }
        callback(error, results);
    });
};

//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require('../models/reviewModel.js');

module.exports.getAllReviews = (req, res) => {
    console.log('GET /api/reviews route hit');
    model.getAllReviews((error, results) => {
        if (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.log('Fetched reviews:', results);
            res.status(200).json(results);
        }
    });
};

module.exports.createReview = (req, res) => {
    const { user_id, username, rating, review_text } = req.body;
    console.log('POST /api/reviews route hit with body:', req.body);
    model.createReview({ user_id, username, rating, review_text }, (error, results) => {
        if (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Review created successfully' });
        }
    });
};

module.exports.updateReview = (req, res) => {
    const { id } = req.params;
    const { review_text } = req.body;
    const { rating } = req.body;
    model.updateReview(id, { review_text, rating }, (error, results) => {
        if (error) {
            console.error('Error updating review:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Review updated successfully' });
        }
    });
};

module.exports.deleteReview = (req, res) => {
    const reviewId = parseInt(req.params.id);

    if (!reviewId) {
        return res.status(400).json({ message: "Invalid review ID" });
    }

    model.deleteReviewById(reviewId, (error, results) => {
        if (error) {
            console.error("Error deleting review:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    });
};

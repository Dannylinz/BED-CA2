//Naing Lin Htet 2329606 DISM/FT/2B/21
const express = require('express');
const controller = require('../controllers/reviewController');

const router = express.Router();

// Route to get all reviews
router.get('/', controller.getAllReviews);

// Route to create a new review
router.post('/', controller.createReview);

// Route to update a review
router.put('/:id', controller.updateReview);

// Route to delete a review
router.delete('/:id', controller.deleteReview);

module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaderboardController');

// Define route for getting the leaderboard
router.get('/', controller.getLeaderboard);

module.exports = router;
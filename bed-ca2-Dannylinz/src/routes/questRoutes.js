// Naing Lin Htet 2329606 DISM/FT/2B/21

// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/questController');


// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
// Route to get all quests
router.get('/', controller.getAllQuests);

// Route to create a new quest
router.post('/', controller.createQuest);

// Route to complete a quest
router.post('/:questId/complete', controller.completeQuest);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;

//MY CA1 no need
// Naing Lin Htet 2329606 DISM/FT/2B/21

// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/questionController');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post('/', controller.createNewQuestion);
router.get('/', controller.readAllQuestion);
router.put('/:question_id', controller.updateQuestionById);
router.delete('/:question_id', controller.deleteQuestionById);
router.post('/:question_id/answers', controller.createNewAnswer);
router.get('/:question_id/answers', controller.readAnswerById);

// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
//Naing Lin Htet 2329606 DISM/FT/2B/21
// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/messageController');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();


router.get('/', (req, res, next) => {
    console.log('GET /api/messages route hit');
    controller.getAllMessages(req, res, next);
});

router.post('/', (req, res, next) => {
    console.log('POST /api/messages route hit with body:', req.body);
    controller.createMessage(req, res, next);
});

// Route to edit a message
router.put('/:id', controller.updateMessage);

router.delete('/:id', controller.deleteMessage);

module.exports = router;

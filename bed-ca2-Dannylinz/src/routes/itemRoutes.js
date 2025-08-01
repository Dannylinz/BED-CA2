//Naing Lin Htet 2329606 DISM/FT/2B/21
// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/itemController');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();



// Route to insert a new item
router.post('/items', controller.insertItem);

// Route to get all items
router.get('/items', controller.getAllItems);

// Route to purchase an item
router.post('/purchase', controller.purchaseItem);

module.exports = router;
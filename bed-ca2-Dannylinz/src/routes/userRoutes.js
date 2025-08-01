// Naing Lin Htet 2329606 DISM/FT/2B/21

// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

const controller = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
//router.post('/', controller.createNewUser, controller.readUserById); 
router.get('/', controller.readAllUsers); 


// Route to get user profile
router.get('/users/:userId', jwtMiddleware.verifyToken, controller.getUserProfile);

router.post("/:user_id/level-up", controller.levelUp);


router.get('/users/:userId/inventory', controller.getUserInventory);
// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;
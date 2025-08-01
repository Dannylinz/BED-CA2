// Naing Lin Htet 2329606 DISM/FT/2B/21

// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const userRoutes = require('./userRoutes');
const questionRoutes = require('./questionRoutes');
const questRoutes = require('./questRoutes');
const itemRoutes = require('./itemRoutes');
const taskRoutes = require('./taskRoutes');
const taskprogressRoutes = require('./taskprogressRoutes');
const messageRoutes = require('./messageRoutes');
const reviewRoutes = require('./reviewRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');



const exampleController = require('../controllers/exampleController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const userController = require('../controllers/userController');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

router.post("/jwt/generate", exampleController.preTokenGenerate, jwtMiddleware.generateToken, exampleController.beforeSendToken, jwtMiddleware.sendToken);
router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);
router.post("/bcrypt/compare", exampleController.preCompare, bcryptMiddleware.comparePassword, exampleController.showCompareSuccess);
router.post("/bcrypt/hash", bcryptMiddleware.hashPassword, exampleController.showHashing);


router.use("/users", userRoutes)
router.use("/questions", questionRoutes)
router.use("/quests", questRoutes)
router.use("/items",itemRoutes)
router.use("/task", taskRoutes)
router.use("/taskprogress", taskprogressRoutes)
router.use("/messages", messageRoutes)
router.use("/reviews",reviewRoutes)
router.use("/leaderboard", leaderboardRoutes)


// ##############################################################
// EXPORT ROUTER
// ##############################################################
module.exports = router;


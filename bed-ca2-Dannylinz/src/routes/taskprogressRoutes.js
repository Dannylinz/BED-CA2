//Naing Lin Htet 2329606 DISM/FT/2B/21
const express = require("express");
const router = express.Router();

const controller = require("../controllers/taskprogressController");
const jwtmiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllTaskprogress);
//router.post("/", jwtmiddleware.verifyToken, controller.createTaskProgress);

router.get("/user", jwtmiddleware.verifyToken, controller.readMessageByuserId);

//router.put("/:progress_id", controller.updateTaskprogressById);

//router.delete("/:progress_id", controller.deleteTaskprogressById);

module.exports = router;
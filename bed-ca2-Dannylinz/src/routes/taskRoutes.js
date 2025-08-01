//Naing Lin Htet 2329606 DISM/FT/2B/21
const express = require("express");
const router = express.Router();

const controller = require("../controllers/taskController");
const jwtmiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllTasks);
//router.post("/", controller.createNewTask);
//router.get("/:task_id", controller.readTaskById);
//router.put("/:task_id", controller.updateTaskById);
//for completing task
router.post("/complete/:task_id", jwtmiddleware.verifyToken, controller.completeTask);

//router.delete("/:task_id", controller.deleteTaskById);
module.exports = router;



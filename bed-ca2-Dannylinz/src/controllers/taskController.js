//Naing Lin Htet 2329606 DISM/FT/2B/21

const model = require("../models/taskModel");

module.exports.readAllTasks = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllUsers:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.selectAll(callback);
};


//module.exports.createNewTask = (req, res, next) => {
//  const data = {
//    title: req.body.title,
//    description: req.body.description,
//    points: req.body.points,
//    user_id: req.body.user_id, 
// };

//  const callback = (error, results, fields) => {
//    if (error) {
//      console.error("Error createNewTask:", error);
//      res.status(500).json(error);
//    } else {
//     res.status(201).json({
//        message: "Task created successfully",
//     });
 //   }
 // };

//  model.createNewTask(data, callback);
//};


//module.exports.readTaskById = (req, res, next) => {
//  const data = {
//   task_id: req.params.task_id,
//  };

//  const callback = (error, results, fields) => {
//    if (error) {
//     console.error("Error readTaskById:", error);
//      res.status(500).json(error);
//   } else {
//      if (results.length == 0) {
//        res.status(404).json({
//          message: "Task not found",
//        });
//      } else res.status(200).json(results[0]);
//    }
//  };

//  model.selectById(data, callback);
//};
//module.exports.updateTaskById = (req, res, next) => {
//  if (
//    req.body.title == undefined ||
//    req.body.description == undefined ||
//    req.body.points == undefined
//  ) {
//    res.status(400).json({
 //     message: "Error: Title or description or points is undefined",
//    });
//    return;
//  }

 // const data = {
//    task_id: req.params.task_id,
 //   title: req.body.title,
 //   description: req.body.description,
 //   points: req.body.points,
 // };

 // const callback = (error, results, fields) => {
 //   if (error) {
 //     console.error("Error updateTaskById:", error);
 //     res.status(500).json(error);
 //   } else {
 //     if (results.affectedRows == 0) {
 //       res.status(404).json({
 //         message: "Task not found",
 //       });
 //     } else
 //       res.status(200).json({
 //         task_id: data.task_id,
 //         title: data.title,
 //         description: data.description,
 //         points: data.points,
 //       });
 //   }
 // };

 // model.updateById(data, callback);
//};
//module.exports.deleteTaskById = (req, res, next) => {
//  const data = {
//    task_id: req.params.task_id,
 // };

 // const callback = (error, results, fields) => {
 //   if (error) {
 //     console.error("Error deleteTaskById:", error);
 //     res.status(500).json(error);
 //   } else {
 //     if (results[0].affectedRows == 0) {
 //       res.status(404).json({
 //         message: "Task not found",
 //       });
 //     } else res.status(204).send(); // 204 No Content
 //   }
 // };

 // model.deleteById(data, callback);
//};

module.exports.completeTask = (req, res, next) => {
  const data = {
    user_id: res.locals.userId, // Assuming user ID is stored in res.locals after authentication
    task_id: req.params.task_id,
    notes: req.body.notes,
    completion_date: new Date() // Sets the completion date to the current date and time
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error completeTask:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({ message: "Task completed and points updated successfully" });
    }
  };

  console.log("Completing task with data:", data);
  model.completeTask(data, callback);
};


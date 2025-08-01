//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require("../models/taskprogressModel");

module.exports.readAllTaskprogress = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllTaskprogress:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };
  model.selectAll(callback);
};

module.exports.readTaskprogressById = (req, res, next) => {
  const data = {
    progress_id: req.params.progress_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readTaskById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Task not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.selectById(data, callback);
};

module.exports.createTaskProgress = (req, res, next) => {
  if (

    req.body.task_id == undefined

  ) {
    res
      .status(400)
      .send("Error: user_id, task_id or completion_date is undefined");
    return;
  }

  const data = {
    user_id: res.locals.userId,
    task_id: req.body.task_id,
    notes: req.body.notes,
  };
  model.checkid(data, (error, results, fields) => {
    if (error) {
      console.error("Error createTaskProgress:", error);
      res.status(500).json(error);
    } else if (results == undefined) {
      console.log(results)
      res.status(404).json({
        message: "user_id or task_id not found",
      });
    } else {
      model.createtaskprogress(data, (error, results, fields) => {
        if (error) {
          console.error("Error createTaskProgress:", error);
          res.status(500).json(error);
        } else if (results.length == 0) {
          //use results.length because the query is select statement
          res.status(404).json({
            message: "user_id or task_id not found",
          });
        } else {
          res.status(201).json(results[1][0]);
        }
      });
    }
  });
};

module.exports.readTaskprogressById = (req, res, next) => {
  const data = {
    progress_id: req.params.progress_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readTaskById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Taskprogress not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.selectById(data, callback);
};

module.exports.updateTaskprogressById = (req, res, next) => {
  if (req.body.notes == undefined) {
   return res.status(400).json({
      error: "Bad Request. Notes is missing in the request body.",
   });
  }

  const data = {
    progress_id: req.params.progress_id,
    notes: req.body.notes,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error updating progress details:", error);
      res.status(500).json(error);
    } else {
      if (results[1].length === 0) {
        res.status(404).json({
          message: "Taskprogress not found",
        });
      } else {
        // console.log(results);
        const updatedProgress = results[1][0];
        res.status(200).json(updatedProgress);
      }
    }
  };

  model.updateById(data, callback);
};

module.exports.deleteTaskprogressById = (req, res, next) => {
  const data = {
    progress_id: req.params.progress_id,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error deleteTaskprogressById:", error);
      res.status(500).json(error);
    } else {
      if (results[0].affectedRows == 0) {
        res.status(404).json({
          message: "Taskprogress not found",
        });
      } else res.status(204).send(); // 204 No Content
    }
  };

  model.deleteById(data, callback);
};


module.exports.readMessageByuserId = (req, res, next) => {
  const data = {
    user_id: res.locals.userId,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readMessageById:", error);
      res.status(500).json(error);
    } else {
      if (results.length == 0) {
        res.status(404).json({
          message: "Message not found",
        });
      } else res.status(200).json(results);
    }
  };

  model.selectByuserId(data, callback);
};
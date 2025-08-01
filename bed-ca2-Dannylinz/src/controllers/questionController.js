//Naing Lin Htet 2329606 DISM/FT/2B/21
//ca1 no need
const model = require("../models/questionModel.js");

// ##############################################################
// CONTROLLER FUNCTION FOR CREATE QUESTION                        Q5 POST /questions
// ##############################################################
//Question 5
module.exports.createNewQuestion = (req, res, next) =>
    {
      const data = {
          question: req.body.question,
          creator_id: req.body.user_id
      }

        if(data.creator_id == undefined || data.creator_id == undefined)
        {
            res.status(400).send("Error: Question or user_id is undefined");
            return;
        } 
        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createNewUser:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                  question_id: results.insertId,
                  question: data.question,
                  creator_id: data.creator_id
                });
            }
        }

        model.insertQuestion(data, callback);
    }

// ##############################################################
// CONTROLLER FUNCTION FOR READ ALL QUESTION                      Q6 GET /questions
// ##############################################################
//Question 6
module.exports.readAllQuestion = (req, res, next) =>
        {
            const callback = (error, results, fields) => {
                if (error) {
                    console.error("Error readAllQuestion:", error);
                    res.status(500).json(error);
                } 
                else res.status(200).json(results);
            }
        
            model.selectAll(callback);
        }

// ##############################################################
// VALIDATION FOR QUESTION CREATOR                                Q7 PUT /questions/:question_id
// ##############################################################
module.exports.checkQuestionOwner = (req, res, next) =>
        {
            const data = {
                question_id: req.params.question_id,
                creator_id: req.body.user_id,
                question: req.body.question
            }
            const callback = (error, results, fields) => {
                for (let i=0;   i<results.length;   i++) {
                if (data.question_id == results[i].question_id && data.creator_id !== results[i].creator_id) {
                res.status(403).json({message: "The Question owner is wrong"})
                
                console.log(results)
                return
                }
            } 
                next()
        }
            model.selectAll(callback);
    }

// ##############################################################
// CONTROLLER FUNCTION FOR UPDATE QUESTION BY ID                  Q7 PUT /questions/:question_id
// ##############################################################
//Question 7
module.exports.updateQuestionById = (req, res, next) =>
    {
        const data = {
            question_id: req.params.question_id,
            creator_id: req.body.user_id,
            question: req.body.question
        }
        if(data.question == undefined || data.creator_id == undefined)
            {
                res.status(400).json({
                    message: "Question or user_id is undefined"
                });
                return;
            } 
        const callback = (error, results, fields) => {
           {
            if (results[0].affectedRows == 0) 
                {
                    res.status(404).json({
                        message: "Question does not exist"
                    });
                    return
                } else {
                    for (let i=0;i<results[1].length;i++) {
                        if (data.question_id == results[1][i].question_id) {
                            res.status(200).json(results[1][i]);
                            return
                        } 
                    }
                    res.status(404).json({
                        message: "Question not found"
                    })
                    console.log(results[1])
            }
        }
        }
            
                model.updateById(data, callback);
            }

// ##############################################################
// CONTROLLER FUNCTION FOR DELETE QUESTION BY ID                  Q8 DELETE /questions/:question_id
// ##############################################################            
//Question 8
module.exports.deleteQuestionById = (req, res, next) =>
            {
                const data = {
                question_id: req.params.question_id
                }
                
                const callback = (error, results, fields) => {
                    if (error) {
                    console.error("Error deleteQuestionById:", error);
                         res.status(500).json(error);
                        } else {
                            if(results.affectedRows == 0) 
                            {
                                res.status(404).json({
                                    message: "Question not found"
                                });
                            }
                            else res.status(204).send(); // 204 No Content            
                        }
                    }
                
                    model.deleteById(data, callback);
                }

// ##############################################################
// VALIDATION FOR USERID & QUESTIONID                             Q9 POST /questions/:questions_id/answers
// ##############################################################
module.exports.checkUser = (req, res, next) =>
 module.exports.checkQuestion = (req, res, next) =>
            {
                const data = {
                    question_id: req.params.question_id,
                }
                const callback = (error, results, fields) => {
                    let valid = 0
                    for (let i=0; i<results.length; i++) {
                        if (data.question_id == results[i].questionid) {
                            valid = 1
                            break
                        }
                    }
                    if (valid==1) {
                        next()
                    } else {
                        res.status(404).json({message: "Question is not found"})
                        return
                    }
                    }
                    model.selectQuestionId(callback)
                }
 
module.exports.checkUser = (req, res, next) =>
                {
                    const data = {
                        creator_id: req.body.user_id
                    }
                    const callback = (error, results, fields) => {
                        let valid = 0
                        for (let i=0;i<results.length;i++) {
                            if (data.creator_id == results[i].user_id) {
                                valid = 1
                                break
                            } 
                        }
                        if (valid==1) {
                                next()
                        } else {
                            res.status(404).json({message: "User not found"})
                            return
                        }
                        }
                    model.selectUserId(callback)
                }


//Question 9 // CONTROLLER FUNCTION FOR CREATE ANSWER 
module.exports.createNewAnswer = (req, res, next) =>
    {
        const data = {
            question_id: req.params.question_id,
            participant_id: req.body.user_id,
            answer: req.body.answer,
            creation_date: req.body.creation_date,
            additional_notes:req.body.additional_notes,
            answered_question_id:req.params.question_id,
            user_id:req.body.user_id
        }
        
          if(data.creation_date == undefined)
          {
              res.status(400).json({
                  message: "Missing creation_date"
              });
              return;
          } 
          const callback = (error, results, fields) => {
              {
                  res.status(201).json({
                    answer_id: results[0].insertId,
                    answered_question_id: data.question_id,
                    participant_id: data.participant_id,
                    answer: data.answer,
                    creation_date: data.creation_date,
                    additional_notes:data.additional_notes
                  });
              }
          }
                
        model.insertAnswer(data, callback);
    }

// ##############################################################
// CONTROLLER FUNCTION FOR READ ANSWER BY QUESTION ID             Q10 GET /questions/:questions_id/answers
// ##############################################################
//Question 10
module.exports.readAnswerById = (req, res, next) =>
                {
                    const data = {
                        question_id: req.params.question_id,
                        answered_question_id:req.params.question_id
                    }
                
                    const callback = (error, results, fields) => {
                        if (error) {
                            console.error("Error readUserById:", error);
                            res.status(500).json(error);
                        } else {
                            if(results.length == 0) 
                            {
                            res.status(404).json({
                            message: "Answer does no exist"
                            });
                        }
                            else res.status(200).json(results);
                    }
                }
                
            model.selectById(data, callback);
            }



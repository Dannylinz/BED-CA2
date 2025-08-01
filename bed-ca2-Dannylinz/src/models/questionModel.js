// Naing Lin Htet 2329606 DISM/FT/2B/21
//my ca1 no need
const pool = require('../services/db');

// ##############################################################
// INSERT OPERATION FOR QUESTION                                  Q5 POST /questions
module.exports.insertQuestion = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO surveyquestion (question, creator_id)
        VALUES (?, ?);
        `;
        const VALUES = [data.question, data.creator_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.selectAll = (callback) =>
        {
            const SQLSTATMENT = `
            SELECT * FROM surveyquestion;
            `;
        
            pool.query(SQLSTATMENT, callback);
        }

// ##############################################################
// UPDATE OPERATIONS FOR QUESTION                                 Q7 PUT /questions/:question_id
// ##############################################################
module.exports.updateById = (data, callback) =>
        {
            const SQLSTATMENT = `
            SELECT * FROM surveyquestion;
            UPDATE surveyquestion
            SET creator_id = ?, question = ?
            WHERE question_id = ?;
            `;
            const VALUES = [data.creator_id, data.question, data.question_id];
            
            pool.query(SQLSTATMENT, VALUES, callback);
        }

// ##############################################################
// DELETE OPERATIONS FOR QUESTION                                 Q8 DELETE /questions/:question_id
// ##############################################################
module.exports.deleteById = (data, callback) =>
        {
            const SQLSTATMENT = `
            DELETE FROM surveyquestion 
            WHERE question_id = ?;
            `;
            const VALUES = [data.question_id];
            
            pool.query(SQLSTATMENT, VALUES, callback);
        }

// ##############################################################
// INSERT OPERATION FOR ANSWER                                    Q9 POST /questions/:questions_id/answers
// ##############################################################
module.exports.insertAnswer = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO useranswer (answered_question_id, participant_id, answer, creation_date, additional_notes)
        VALUES (?,?,?,?,?);
        UPDATE user
        SET points = points+5
        WHERE user_id = ?;
        `;
        const VALUES = [data.answered_question_id,data.participant_id,data.answer,data.creation_date,data.additional_notes,data.user_id];
    
        pool.query(SQLSTATMENT, VALUES, callback);
    }
// ##############################################################
// SELECT BY QUESTION ID OPERATIONS FOR ANSWER                    Q10 GET /questions/:questions_id/answers
// ##############################################################
module.exports.selectById = (data, callback) =>
        {
            const SQLSTATMENT = `
            SELECT * FROM useranswer
            WHERE answered_question_id = ?;
            `;
            const VALUES = [data.answered_question_id];
                
            pool.query(SQLSTATMENT, VALUES, callback);
        }

// ##############################################################
// SELECT BY USER & QUESTION ID OPERATIONS FOR ANSWER             verfiyUserId and verfiyQnId
// ##############################################################
module.exports.selectQuestionId = (callback) =>
        {
            const SQLSTATMENT = `
            SELECT question_id FROM surveyquestion;
            `;
            
            pool.query(SQLSTATMENT, callback);
        }
// ##############################################################
// SELECT BY USER & QUESTION ID OPERATIONS FOR ANSWER             verfiyUserId and verfiyQnId
// ##############################################################
module.exports.selectUserId = (callback) =>
        {
            const SQLSTATMENT = `
            SELECT user_id FROM user;
            `;
            
            pool.query(SQLSTATMENT, callback);
        }  
           
//Naing Lin Htet 2329606 DISM/FT/2B/21

const model = require("../models/questModel.js");



module.exports.createQuest = (req, res) => {
  const data = {
    quest_name: req.body.quest_name,
    quest_description: req.body.quest_description,
    level: req.body.level,
    price: req.body.price,
    created_by_username: req.body.username // Assumes the username is passed in the request body
  };

  model.addQuest(data, (error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(201).json({ message: "Quest created successfully" });
    }
  });
};

module.exports.getAllQuests = (req, res) => {
  model.getAllQuests((error, results) => {
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
};

module.exports.completeQuest = (req, res) => {
    const questId = req.params.questId;
    const userId = req.body.user_id; // Extract user_id from request body
    const username = req.body.username; // Extract username from request body
  
    const data = {
      quest_id: questId,
      user_id: userId,
      username: username
    };
  
    model.completeQuest(data, (error) => {
      if (error) {
        console.error('Error completing quest:', error);
        return res.status(400).json({ message: error.message }); // Send the custom error message
      }
      res.status(200).json({ message: 'Quest completed successfully!' });
    });
  };


  

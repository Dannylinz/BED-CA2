//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require("../models/userModel.js");

module.exports.checkUsernameOrEmailExist = (req, res, next) => {
  const {username, email} = req.body;
  if (!username || !email) {
      res.status(400).json({Error: `Input is unacceptable`});
      return;
  } else {
      const data = {
          username: username,
          email: email
      }

      const callback = (error, results, fields) => {
          if (error) {
              res.status(500).json({message: "Internal Server Error"});
          } else if (results.length !== 0) {
              res.status(409).json({message: "Username or email already exists"});
          } else {
              next();
          }
      }
  
      model.selectByUsernameOrEmail(data, callback);
  }
  
}

//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) => {
  const { username, password } = req.body;

  console.log("Login request received with body:", req.body);

  if (!username || !password) {
    console.log("Validation failed: Missing username or password");
    res.status(400).json({ Error: `name or password is unacceptable` });
    return;
  }

  const data = { username: username };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    } else if (results.length === 0) {
      console.log("User not found for username:", username);
      res.status(404).json({ message: "User not found" });
    } else {
      console.log("User found:", results[0]);
      res.locals.user_id = results[0].user_id;
      res.locals.username = results[0].username;
      res.locals.hash = results[0].password;
      next();
    }
  };

  model.selectByUsername(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
      res.status(400).json({Error: `Input is unacceptable`});
      return;
  } else {
      const data = {
          username: username,
          email: email,
          password: res.locals.hash
      }

      const callback = (error, results, fields) => {
          if (error) {
              console.error("Error createNewUser:", error);
              res.status(500).json(error);
          } else {
              // res.status(200).json({message: `User ${data.username} created successfully.`});
              res.locals.message = `User ${data.username} created successfully.`;
              next();
          }
      }
  
      model.insertSingle(data, callback);
  }

}



module.exports.readAllUsers = (req, res, next) => {
  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error readAllUsers:", error);
      res.status(500).json(error);
    } else res.status(200).json(results);
  };

  model.selectAll(callback);
};

module.exports.createNewUser = (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    res.status(400).send("Error: name or email is missing");
    return;
  }

  const data = {
    name: req.body.name,
    email: req.body.email,
  };

  const callback = (error, results, fields) => {
    if (error) {
      console.error("Error creating new player:", error);
      res.status(500).json(error);
    } else {
      res.status(201).json({
        player_id: results.insertId,
        ...data,
      });
    }
  };

  model.insertSingle(data, callback);
};

module.exports.getAllPlayers = (req, res, next) => {
  const userId = req.user.id; // Assuming req.user contains the authenticated user's details
  
  if (!userId) {
    return res.status(404).json({ message: "User ID not found!" });
  }

  const callback = (errors, results, fields) => {
    if (errors) {
      res.status(500).json({ Error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  };

  const data = { userId };
  model.selectByUserId(data, callback);
};



module.exports.getUserProfile = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID not found" });
  }

  const data = { user_id: userId };

  const callback = (error, results) => {
    if (error) {
      console.log("Database error:", error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  };

  model.getUserById(data, callback);
  }

  module.exports.levelUp = (req, res, next) => {
    const userId = req.params.user_id;
  
    // Fetch user data to check points and current level
    model.getUserById({ user_id: userId }, (error, results) => {
      if (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json(error);
      } else {
        const user = results[0];
        const pointsToNextLevel = Math.pow(2, user.level - 1) * 200;
  
        if (user.points >= pointsToNextLevel) {
          model.levelUpUser({ user_id: userId, pointsToDeduct: pointsToNextLevel }, (updateError, updateResults) => {
            if (updateError) {
              console.error("Error leveling up user:", updateError);
              res.status(500).json(updateError);
            } else {
              res.status(200).json({ message: "Level up successful" });
            }
          });
        } else {
          res.status(400).json({ message: "Not enough points to level up" });
        }
      }
    });
  };

  module.exports.getUserInventory = (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        console.error('Error: Missing required field (user_id)');
        return res.status(400).json({ error: 'Missing required field (user_id)' });
    }

    console.log('Fetching inventory for user ID:', userId); // Debugging line

    model.getUserInventory(userId, (error, results) => {
        if (error) {
            console.error('Error fetching inventory:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json(results);
    });
};
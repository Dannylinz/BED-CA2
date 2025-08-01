//Naing Lin Htet 2329606 DISM/FT/2B/21

//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////
module.exports.comparePassword = (req, res, next) => {
  console.log("Comparing password");

  bcrypt.compare(req.body.password, res.locals.hash, (err, isMatch) => {
    if (err) {
      console.error("Error comparing password:", err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (isMatch) {
      console.log("Password match successful");
      next();
    } else {
      console.log("Password match failed");
      res.status(401).json({ message: 'Wrong password' });
    }
  });
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
  console.log("Hashing password");

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log("Password hashed successfully");
    res.locals.hash = hash;
    next();
  });
};

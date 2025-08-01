//Naing Lin Htet 2329606 DISM/FT/2B/21

//////////////////////////////////////////////////////
// REQUIRE DOTENV MODULE
//////////////////////////////////////////////////////
require("dotenv").config();

//////////////////////////////////////////////////////
// REQUIRE JWT MODULE
//////////////////////////////////////////////////////
const jwt = require("jsonwebtoken");

//////////////////////////////////////////////////////
// SET JWT CONFIGURATION
//////////////////////////////////////////////////////
const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN;
const tokenAlgorithm = process.env.JWT_ALGORITHM;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR GENERATING JWT TOKEN
//////////////////////////////////////////////////////
module.exports.generateToken = (req, res, next) => {
  console.log("Generating JWT token");

  const payload = {
    userId: res.locals.user_id,
    timestamp: new Date()
  };

  const options = {
    algorithm: tokenAlgorithm,
    expiresIn: tokenDuration
  };

  jwt.sign(payload, secretKey, options, (err, token) => {
    if (err) {
      console.error("Error generating token:", err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log("Token generated successfully:", token);
    res.locals.token = token;
    next();
  });
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR SENDING JWT TOKEN
//////////////////////////////////////////////////////
module.exports.sendToken = (req, res, next) => {
  console.log("Sending token");

  res.status(200).json({
    message: res.locals.message || 'Token sent successfully',
    token: res.locals.token,
    username: res.locals.username,
    user_id: res.locals.user_id
  });
};

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR VERIFYING JWT TOKEN
//////////////////////////////////////////////////////
module.exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    const callback = (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }

        res.locals.userId = decoded.userId;
        res.locals.tokenTimestamp = decoded.timestamp;
        next();
    };

    jwt.verify(token, secretKey, callback);
};

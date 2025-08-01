//Naing Lin Htet 2329606 DISM/FT/2B/21
const model = require('../models/leaderboardModel.js');

module.exports.getLeaderboard = (req, res, next) => {
    const callback = (errors, results, fields) => {
        if (errors) {
            res.status(500).json({ message: "Error retrieving leaderboard data" });
        } else {
            res.status(200).json(results);
        }
    };

    model.getLeaderboard(callback);
};
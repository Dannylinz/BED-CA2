//Naing Lin Htet 2329606 DISM/FT/2B/21

//////////////////////////////////////////////////////
// INCLUDES
//////////////////////////////////////////////////////
const express = require('express');
const mainRoutes = require('./routes/mainRoutes');
const itemRoutes = require('./routes/itemRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskprogressRoutes = require('./routes/taskprogressRoutes');
const userRoutes = require('./routes/userRoutes');
const questRoutes = require('./routes/questRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
//////////////////////////////////////////////////////
// CREATE APP
//////////////////////////////////////////////////////
const app = express();

//////////////////////////////////////////////////////
// USES
//////////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//////////////////////////////////////////////////////
// SETUP STATIC FILES
//////////////////////////////////////////////////////

app.use("/", express.static('public'));

//////////////////////////////////////////////////////
// SETUP ROUTES
//////////////////////////////////////////////////////

// app.get('/', (req, res) => {
//     res.send('YCF server: I am Alive!')
// })

app.use("/api", mainRoutes);
app.use("/api", itemRoutes);
app.use("/api", taskRoutes);
app.use("/api", taskprogressRoutes);
app.use("/api", userRoutes);
app.use("/api", questRoutes);
app.use('/api/messages', (req, res, next) => {
    console.log(`Incoming request to ${req.originalUrl}`);
    next();
}, messageRoutes);
app.use("/api/reviews", (req, res, next) => {
    console.log(`Incoming request to ${req.originalUrl}`);
    next();
}, reviewRoutes);
app.use("/api", leaderboardRoutes);
console.log('Routes setup complete');


//////////////////////////////////////////////////////
// EXPORT APP
//////////////////////////////////////////////////////
module.exports = app
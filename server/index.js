//Depedencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
app.use(compression());
app.use(morgan('dev'));

const activityLog = require('./routes/activity-log');

// //Port Number
const port = process.env.PORT || 3000;

// //CORS Middleware
// app.use(cors());

// //Set Static Folder
app.use(express.static(path.join(__dirname, '../build')));

// //Body Parser Middleware
app.use(bodyParser.json());

app.use('/activity_log', activityLog)

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

//Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

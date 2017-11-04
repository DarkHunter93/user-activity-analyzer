//TODO w rozszerzeniu - walidacja pola rejestracji
//TODO potwierdzanie rejestracji mailem

'use strict';

let express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    winston = require('winston'),
    path = require('path'),
    cors = require('cors'),
    docs = require('./routes/docs'),
    login = require('./routes/login'),
    users = require('./routes/users'),
    histories = require('./routes/histories'),
    tokens = require('./routes/tokens');

// options for the winston logger
let logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './public/server.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            timestamp: true
        })
    ],
    exitOnError: false
}).stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

// initialize app
let app = express();

// if you're using local copy you should import data from config.js file
// if you're using Heroku App you should use Heroku Environment Variables
try {
    var config = require('./config');
}
catch (e) {
    console.error('Cannot find config.js');
}

app.use(morgan('short', {"stream": logger.stream}));
app.use(morgan('dev'));

// set port number
try {
    app.set('PORT', process.env.PORT || config.PORT);
}
catch (e) {
    throw new Error('Cannot set PORT');
}

// connect to database
try {
    mongoose.connect(process.env.MONGODB_URI || config.MONGODB_URI);
}
catch (e) {
    throw new Error('Cannot connect to the database');
}

// parse requests bodies to JSON format
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '5mb'}));

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/docs', docs);
app.use('/login', login);
app.use('/users', users);
app.use('/histories', histories);
app.use('/tokens', tokens);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({message: error.message});
});

app.listen(app.get('PORT'), function () {
    console.log('Node app is running on port', app.get('PORT'));
});
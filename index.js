var express     = require('express');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var JWT         = require('jsonwebtoken');
var winston     = require('winston');
var async       = require('async');
var path        = require('path');
var url         = require('url');
var UUID        = require('uuid/v4');
var swagger     = require('swagger-jsdoc');
var cors        = require('cors');
var config      = require('./config');
// var User        = require('./app/models/user');
// var History     = require('./app/models/history');
var users       = require('./app/routes/users');
// var histories   = require('./app/routes/histories');
// var websites    = require('./app/routes/websites');
// var login       = require('./app/routes/login');

var swaggerDefinition = {
  info: {
    title: 'User Activity Analyzer',
    version: '0.4.0'
  },
  host: 'user-activity-analyzer.herokuapp.com', // optional
  basePath: '/',          // optional
};

// options for the swagger docs
var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./app/routes/users.js',
         './app/routes/histories.js',
         './app/routes/websites.js',
         './app/routes/login.js'],
};

// options for the winston logger
var logger = new winston.Logger({
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
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

var swaggerSpec = swagger(options);
var app         = express();

app.use(morgan('short', { "stream": logger.stream }));
app.use(morgan('dev'));

// connect to database
mongoose.connect(config.database);

// set global variable for JWT
app.set('superSecret', config.secret);

// parse requests bodies to JSON format
app.use(bodyParser.json( { limit: '5mb'} ));
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.get('/api-docs.json', function(req, res) {

  logger.info(JSON.stringify(req.body));

  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

users.setup(app, logger);
// histories.setup(app, logger);
// login.setup(app, logger);
// websites.setup(app, logger);

// app.get('*', wrong);
// app.delete('*', wrong);
// app.patch('*', wrong);
// app.post('*', wrong);

var port = process.env.PORT || 8888;
app.listen(port);
console.log('Server running at http://localhost:' + port);

function wrong(req, res) {
  res.status(404).json({ message: 'The requested resource does not exist on the server' });
}

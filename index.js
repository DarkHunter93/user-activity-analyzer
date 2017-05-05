var express 		= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var jwt    			= require('jsonwebtoken');
var winston 		= require('winston');
var path 				= require('path');
var config 			= require('./config');
var User   			= require('./app/models/user');

winston.add(winston.transports.File, { filename: './public/server.log' });

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.post('/setup', function(req, res) {
	winston.info(`POST /setup with body: ${JSON.stringify(req.body)}`);
	console.log(`POST /setup with body: ${JSON.stringify(req.body)}`);

	if (req.body.login == undefined || req.body.login == null) {
		return res.json({ success: false, message: 'req.body.login is null or undefined' });
	} else if (req.body.password == undefined || req.body.password == null) {
		return res.json({ success: false, message: 'req.body.password is null or undefined' });
	} else {
		var login = req.body.login;
		var password = req.body.password;

		var nick = new User({
			login: login,
			password: password,
			admin: false
		});

		nick.save(function(err) {
			if (err) throw err;

			console.log('User saved successfully');
			res.json({ success: true });
		});
	}
});

app.get('/', function(req, res) {
  winston.info('GET /');
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res) {
	winston.info(`POST /api/authenticate with body: ${JSON.stringify(req.body)}`);

	User.findOne({
		login: req.body.login
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			console.log(`Authentication for user with login: ${req.body.login} and password: ${req.body.password} failed. User not found`);
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			if (user.password != req.body.password) {
				console.log(`Authentication for user with login: ${req.body.login} and password: ${req.body.password} failed. Wrong password`);
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 3600 // 1 hour
				});
				winston.info(`Token for ${req.body.login}: ${token}`);
				console.log(`Token for ${req.body.login}: ${token}`);

				res.status(200).json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

apiRoutes.use(function(req, res, next) {
	var token = req.body.token || req.param('token');

	if (token) {

		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				next();
			}
		});

	} else {

		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

apiRoutes.get('/check', function(req, res) {
	winston.info(`GET /api/check with query.token: ${req.query.token}`);
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server running at http://localhost:' + port);

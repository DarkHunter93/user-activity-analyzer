var express 		= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var JWT    			= require('jsonwebtoken');
var winston 		= require('winston');
var path 				= require('path');
var url					= require('url');
const UUID      = require('uuid/v4');
var config 			= require('./config');
var User   			= require('./app/models/user');
var History     = require('./app/models/history');

winston.add(winston.transports.File, { filename: './public/server.log' });

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/', function(req, res) {
  winston.info('GET /');
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.post('/register', function(req, res) {
	winston.info(`POST /setup with body: ${JSON.stringify(req.body)}`);

	if (req.body.login == undefined || req.body.login == null) {
		return res.status(400).json({ success: false, message: 'Login is null or undefined' });
	} else if (req.body.password == undefined || req.body.password == null) {
		return res.status(400).json({ success: false, message: 'Password is null or undefined' });
	} else if (req.body.email == undefined || req.body.email == null) {
		return res.status(400).json({ success: false, message: 'Email is null or undefined' });
	} else {
		var login = req.body.login;
		var password = req.body.password;
    var email = req.body.email;

		User.findOne({
			login: req.body.login
		}, (error, user) => {
			if (error) {
				throw error;
			} else if (user) {
				return res.status(400).json({ success: false, message: 'Login is already in use' });
			} else {

				var user = new User({
          id: UUID(),
					login: login,
					password: password,
          email: email
				});

				user.save((error) => {
					if (error) throw error;

					res.status(201).json({ success: true, message: 'User registered successfully' });
				});
			}
		});
	}
});

var apiRoutes = express.Router();

apiRoutes.post('/login', function(req, res) {
	winston.info(`POST /api/authenticate with body: ${JSON.stringify(req.body)}`);

	User.findOne({
		login: req.body.login
	}, (error, user) => {

		if (error) {
			throw error;
		} else if (!user) {
			res.status(400).json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			if (user.password != req.body.password) {
				res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				var token = JWT.sign(user, app.get('superSecret'), {
					expiresIn: 7200
				});
				winston.info(`Token for ${req.body.login}: ${token}`);

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
	var token = req.body.token || req.query.token;

	if (token) {
		JWT.verify(token, app.get('superSecret'), (error, decoded) => {
			if (error) {
				return res.json({ success: false, message: 'Failed to authenticate token.'});
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
	res.json({
    id: req.decoded._doc.id,
		login: req.decoded._doc.login,
		password: req.decoded._doc.password,
		admin: req.decoded._doc.admin
	});
});

apiRoutes.post('/check', function(req, res) {
	winston.info(`POST /api/check with token: ${req.query.token}`);
	res.json({
    id: req.decoded._doc.id,
		login: req.decoded._doc.login,
		password: req.decoded._doc.password,
		admin: req.decoded._doc.admin
	});
});

apiRoutes.get('/history', (req, res) => {
	winston.info(`POST /api/history user: ${req.query.user}, url: ${req.query.url}, offset: ${req.query.offset}, limit: ${req.query.limit}`);

	var user = req.query.user, url = req.query.url, offset = parseInt(req.query.offset) || 0,
	 		limit = parseInt(req.query.limit) || 100;

	if (user && url) {
		History.
		  find({
				owner: user,
				url: url
		  }).
			limit(limit).
			skip(offset).
			exec(function (error, data) {
			  if (error) {
					return res.json({
						success: false,
						message: `Unidentified error 003`
					});
				} else {
					console.log(data);
					return res.json({
						success: true,
						data: data
					});
				}
			});
	} else {
		if (!user) {
			return res.json({
				success: false,
				message: `User not found`
			});
		} else if (!url) {
			return res.json({
				success: false,
				message: `Url not found`
			});
		} else {
			return res.json({
				success: false,
				message: `Unidentified error 002`
			});
		}
	}
});

apiRoutes.post('/history', (req, res) => {
	winston.info(`POST /api/history with body: ${JSON.stringify(req.body)}`);

	History.create({
		ownerId: req.decoded._doc.id,
		url: req.body.url,
		parentUrl: req.body.parentUrl,
		time: req.body.time
	}, function(error) {
		if (error) {
			if (error.errors['ownerId']) {
				return res.json({ success: false, message: error.errors['owner'].message});
			} else if (error.errors['url']) {
				return res.json({ success: false, message: error.errors['url'].message});
			} else if (error.errors['parentUrl']) {
				return res.json({ success: false, message: error.errors['parentUrl'].message});
			} else if (error.errors['time']) {
				return res.json({ success: false, message: error.errors['time'].message});
			} else {
				return res.json({ success: false, message: 'Unidentified error 001'});
			}
		} else {
			return res.json({ success: true, message: 'History record saved succesfully' });
		}
	});
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server running at http://localhost:' + port);

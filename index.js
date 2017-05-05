var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model

var port = process.env.PORT || 8080;
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.post('/setup', function(req, res) {
	if (req.body.login == undefined || req.body.login == null) {
		return res.json({ success: false, message: 'req.body.login is null or undefined' });
	} else if (req.body.password != undefined || req.body.password != null) {
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
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// get an instance of the router for api routes
var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res) {

	console.log("Authentication for login: " + req.body.login);
	console.log("Authentication for password: " + req.body.password);

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

				console.log(`Authentication for user with login: ${req.body.login} and password: ${req.body.password} successful`);
				console.log(`Token for user with login: ${req.body.login}: ${token}`);

				res.json({
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

apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the API!' });
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server running at http://localhost:' + port);

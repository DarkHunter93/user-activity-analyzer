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
var config      = require('./config');
var User        = require('./app/models/user');
var History     = require('./app/models/history');

var swaggerDefinition = {
  info: {
    title: 'User Activity Analyzer',
    version: '0.0.4'
  },
  host: 'localhost:8080', // optional
  basePath: '/',          // optional
};

// Options for the swagger docs
var options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: ['./index.js'],
};

var swaggerSpec = swagger(options);
var app         = express();
var apiRoutes   = express.Router();

// save Winston's logs to file
winston.add(winston.transports.File, { filename: './public/server.log' });

// connect to database
mongoose.connect(config.database);

// set global variable for JWT
app.set('superSecret', config.secret);

// parse requests bodies to JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// use HTTP request logger
app.use(morgan('dev'));

app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     description: Register user to the application
 *     tags: [Users, Register]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object that needs to be added to the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *               example: Madonna
 *             password:
 *               type: string
 *               example: bitchIAmMadonna
 *             email:
 *               type: string
 *               example: queen@madonna.com
 *     responses:
 *       201:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User registered successfully
 *             user:
 *               type: object
 *               properties:
 *                 id: string
 *                 login: string
 *                 password: string
 *                 email: string
 *       409:
 *         description: Login is already in use
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Login is already in use
 *       422:
 *         description: Login, password or email are null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Login is null or undefined
 *       500:
 *         description: Internal Server Error
 */
apiRoutes.post('/users/register', function(req, res) {

	if (req.body.login == undefined || req.body.login == null) {

    /*
    422: the server understands the content type of the request entity
    (hence a 415 Unsupported Media Type status code is inappropriate),
    and the syntax of the request entity is correct (thus a 400 Bad Request
    status code is inappropriate) but was unable to process the contained
    instructions.
    */

		return res.status(422).json({ success: false, message: 'Login is null or undefined' });

	} else if (req.body.password == undefined || req.body.password == null) {

		return res.status(422).json({ success: false, message: 'Password is null or undefined' });

	} else if (req.body.email == undefined || req.body.email == null) {

		return res.status(422).json({ success: false, message: 'Email is null or undefined' });

	} else {

		var login = req.body.login, password = req.body.password, email = req.body.email;

		User.findOne({ login: login }, (error, user) => {

      if (error) {

        /*
        500: the server encountered an unexpected condition that prevented it
        from fulfilling the request.
        */

        return res.status(500).json({ success: false, message: error });

			} else if (user) {

        /*
        409: the request could not be completed due to a conflict with the current
        state of the target resource. This code is used in situations where the
        user might be able to resolve the conflict and resubmit the request.
        */

				return res.status(409).json({ success: false, message: 'Login is already in use' });

			} else {

				var user = new User({
          id: UUID(),
					login: login,
					password: password,
          email: email
				});

				user.save((error) => {
          if (error) {

            return res.status(500).json({ success: false, message: error });

          } else {

            /*
            201: the request has been fulfilled and has resulted in
            one or more new resources being created.
            */

            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              user: {
                id: user.id,
                login: user.login,
                password: user.password,
                email: user.email
              }
            });
          }
				});
			}
		});
	}
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Login user to the application
 *     tags: [Users, Login]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object that needs to be searched in the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *               example: Madonna
 *             password:
 *               type: string
 *               example: bitchIAmMadonna
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User logged in successfully
 *             token: string
 *       409:
 *         description: User not found or wrong password
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: User not found
 *       422:
 *         description: Login, password or email are null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Login is null or undefined
 *       500:
 *         description: Internal Server Error
 */
apiRoutes.post('/users/login', function(req, res) {

  if (req.body.login == undefined || req.body.login == null) {

    return res.status(422).json({ success: false, message: 'Login is null or undefined' });

  } else if (req.body.password == undefined || req.body.password == null) {

		return res.status(422).json({ success: false, message: 'Password is null or undefined' });

	} else {

    User.findOne({ login: req.body.login }, (error, user) => {

      if (error) {

        return res.status(500).json({ success: false, message: error });

			} else if (!user) {

        return res.status(409).json({ success: false, message: 'User not found' });

  		} else {

  			if (user.password != req.body.password) {

  				res.status(409).json({ success: false, message: 'Wrong password' });

        } else {

  				var token = JWT.sign(user, app.get('superSecret'), { expiresIn: 7200 });

  				res.status(200).json({
  					success: true,
  					message: 'User logged in successfully',
  					token: token
  				});
  			}
  		}
  	});
  }
});

// the JWT authentication middleware authenticates callers using a JWT
apiRoutes.use((req, res, next) => {

	var token = req.body.token || req.query.token;

  if (token) {

		JWT.verify(token, app.get('superSecret'), (error, decoded) => {

      if (error) {

        switch(error.name) {

          case 'TokenExpiredError':

            return res.status(409).json({ success: false, message: 'The token is expired' });

          case 'JsonWebTokenError':

            return res.status(500).json({ success: false, message: error.message });

          default:

            return res.status(500).json({ success: false, message: 'Unknown server error 0002' });
        }

			} else {

        User.findOne({
          login: decoded._doc.login,
          password: decoded._doc.password,
          email: decoded._doc.email
        }, (error, user) => {

          if (error) {

            return res.status(500).json({ success: false, message: error });

          } else if (!user) {

            return res.status(409).json({ success: false, message: 'The token is expired' });

          } else {

            req.decoded = decoded;
    				next();

          }
        });
      }
		});

	} else {

		return res.status(422).json({ success: false, message: 'No token provided' });

	}
});

/**
 * @swagger
 * /api/users:
 *   delete:
 *     description: Remove user from the application
 *     tags: [Users, Remove, Delete]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Token for user that needs to be removed in the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token: string
 *     responses:
 *       200:
 *         description: User has been removed correctly
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User has been removed correctly
 *       422:
 *         description: Login, password or email are null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Login is null or undefined
 *       500:
 *         description: Internal Server Error
 */
apiRoutes.delete('/users', (req, res) => {

  var login = req.decoded._doc.login, password = req.decoded._doc.password;

  if (login && password) {

    User.remove({ login: login, password: password }, (error) => {

      if (error) {

  			return res.status(500).json({ success: false, message: error });

  		} else {

        return res.status(200).json({ success: true, message: 'User has been removed correctly' });

      }
    });

  } else {

    if (login == undefined || login == null) {

  		return res.status(422).json({ success: false, message: 'Login is null or undefined' });

  	} else if (password == undefined || password == null) {

  		return res.status(422).json({ success: false, message: 'Password is null or undefined' });

  	} else {

      return res.status(500).json({ success: false, message: 'Unidentified error 0001' });

    }
  }
});

/**
 * @swagger
 * /api/users:
 *   put:
 *     description: Update user account
 *     tags: [Users, Remove, Delete]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           Token and one or more property for user that needs to be updated
 *           in the database. Each update requires a re-login.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               required: true
 *             newLogin:
 *               type: string
 *               example: Bunny
 *               required: false
 *             newPassword:
 *               type: string
 *               example: iLikeBunnies
 *               required: false
 *             newEmail:
 *               type: string
 *               example: bunny@gmail.com
 *               required: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User updated successfully
 *       422:
 *         description: None of the properties (newLogin, newPassword, newEmail) have been sent
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: Nothing to update
 *       500:
 *         description: Internal Server Error
 */
apiRoutes.put('/users', (req, res) => {

  var login = req.decoded._doc.login, newLogin = req.body.newLogin,
      newPassword = req.body.newPassword, newEmail = req.body.newEmail,
      update = {};

  var query = { login: login };

  async.waterfall([
    (callback) => {

      if (!newLogin && !newPassword && !newEmail) {

        return res.status(422).json({ success: false, message: 'Nothing to update' });

      } else if (newLogin) {

        User.findOne({ login: newLogin }, (error, user) => {

          if (error) {

            return res.status(500).json({ success: false, message: error });

          } else if (user) {

            return res.status(409).json({ success: false, message: 'Login is already in use' });

          } else {

            update.login = newLogin;
            callback(null);

          }
        });
      } else {

        callback(null);

      };
    },
    (callback) => {

      if (newPassword) { update.password = newPassword };

      if (newEmail) { update.email = newEmail };

      User.findOneAndUpdate(query, update, (error, user) => {
        if (error) {

          return res.status(500).json({ success: false, message: error });

        } else {

          return res.status(200).json({ success: true, message: 'User updated successfully'});

        }
      });
    }
  ]);
});

apiRoutes.post('/get-history-commands', (req, res) => {

  var offset = parseInt(req.body.offset) || 0, limit = parseInt(req.body.limit) || 100;

  var searchingProperties = req.body.searchingProperties;

  if (searchingProperties) {
  	History.
  	  find(searchingProperties, '-_id -__v').
  		limit(limit).
  		skip(offset).
  		exec(function (error, data) {
  		  if (error) {
  				return res.json({
  					success: false,
  					message: `Unidentified error 003`
  				});
  			} else {
          return res.json({
  					success: true,
  					data: data
  				});
  			}
  		});
  } else {
    return res.status(422).json({ success: false, message: `'searchingProperties' is null or undefined.` });
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

var port = process.env.PORT || 8888;
app.listen(port);
console.log('Server running at http://localhost:' + port);

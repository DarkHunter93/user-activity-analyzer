'use strict';

var JWT         = require('jsonwebtoken');
var async       = require('async');
var UUID        = require('uuid/v4');
var config      = require('../../config');
var User        = require('../models/user');

module.exports.setup = function(app, logger) {

/**
 * @swagger
 * /users/register:
 *   post:
 *     description: Register user to the application
 *     tags: [Users]
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
app.post('/users/register', function(req, res) {

  logger.info(JSON.stringify(req.body));

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

            return res.status(201).json({
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
 *     tags: [Users]
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
 *         description: Token is valid for 12 hours
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: User logged in successfully
 *             token:
 *               type: string
 *       409:
 *         description: Wrong password or user not found
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
 *         description: Login or password are null or undefined
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
app.post('/users/login', function(req, res) {

  logger.info(JSON.stringify(req.body));

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

  				var token = JWT.sign(user, app.get('superSecret'), { expiresIn: 43200 });

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
app.use((req, res, next) => {

	var token = req.get('Authorization') || req.body.token || req.query.token;

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

            return res.status(409).json({ message: 'The token is expired' });

          } else {

            req.decoded = decoded;
    				next();

          }
        });
      }
		});

	} else {

		return res.status(422).json({ message: 'No token provided' });

	}
});

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get array of users objects
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: "Limit of users"
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: "Offset of users"
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               description: Number of returned users
 *             users:
 *               type: array
 *               description: "Array of users objects"
 *               example: [
 *                 {
 *                   "id": "73988969-49f6-48a8-9ec0-02d552ca24d8",
 *                   "login": "Madonna",
 *                   "email": "queen@madonna.com"
 *                 },
 *                 {
 *                   "id": "f31a47cc-6184-468f-9109-cb929bd39bea",
 *                   "login": "Client",
 *                   "email": "Client@gmail.com"
 *                 }
 *               ]
 *       409:
 *         description: The token is expired
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: The token is expired
 *       422:
 *         description: No token provided
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: No token provided
 *       500:
 *         description: Internal Server Error
 */
app.get('/users', (req, res) => {

  logger.info(JSON.stringify(req.body));

  var offset = parseInt(req.query.offset) || 0, limit = parseInt(req.query.limit) || 100,
      searchingProperties = {};

  User.find(searchingProperties, '-_id -__v -password -admin')
      .limit(limit)
      .skip(offset)
      .exec((error, data) => {

        if (error) {

          return res.status(500).json({ message: error });

        } else {

          return res.status(200).json({ count: data.length, users: data });

        }
      });
});


  /**
   * @swagger
   * /users:
   *   delete:
   *     description: Remove user from the application
   *     tags: [Users]
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
  app.delete('/users', (req, res) => {

    logger.info(JSON.stringify(req.body));

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
   * /users:
   *   put:
   *     description: Update user account
   *     tags: [Users]
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
  app.put('/users', (req, res) => {

    logger.info(JSON.stringify(req.body));

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
};

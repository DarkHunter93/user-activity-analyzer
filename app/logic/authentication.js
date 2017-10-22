var JWT       = require('jsonwebtoken');
var User      = require('../../models/user');
var config    = require('../../config');

function authentication(req, res, next) {

	var token = req.get('Authorization');

  if (token) {

		JWT.verify(token, config.secret, (error, decoded) => {

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

};

module.exports = {
    authentication: authentication
};

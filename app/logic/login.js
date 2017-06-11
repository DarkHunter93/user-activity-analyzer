var JWT       = require('jsonwebtoken');
var User      = require('../models/user');
var config    = require('../../config');

function login(req, res) {

  if (!req.body.login || !req.body.password) {

    return res.status(422).json({ success: false, message: 'Login or password are null or undefined' });

  } else {

    User.findOne({ login: req.body.login }, (error, user) => {

      if (error) {

        return res.status(500).json({ message: error });

      } else if (!user) {

        return res.status(409).json({ message: 'User not found' });

      } else if (user.password != req.body.password) {

        return res.status(409).json({ message: 'Wrong password' });

      } else {

        var token = JWT.sign(user, config.secret, { expiresIn: 43200 });

        return res.status(200).json({
          user: {
            id: user.id,
            login: user.login
          },
          token: token
        });
      }
    });
  }
};

module.exports = {
    login: login
};

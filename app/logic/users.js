var JWT         = require('jsonwebtoken');
var UUID        = require('uuid/v4');
var config      = require('../../config');
var User        = require('../../models/user');
var Database    = require('../database');

function register(req, res) {

  if (!req.body.login || !req.body.password || !req.body.email) {

    /*
    422: the server understands the content type of the request entity
    (hence a 415 Unsupported Media Type status code is inappropriate),
    and the syntax of the request entity is correct (thus a 400 Bad Request
    status code is inappropriate) but was unable to process the contained
    instructions.
    */

    return res.status(422).json({ message: 'Login, password or email are null or undefined' });

  } else {

    var login = req.body.login, password = req.body.password, email = req.body.email;

    User.findOne({ login: login }, (error, user) => {

      if (error) {

        /*
        500: the server encountered an unexpected condition that prevented it
        from fulfilling the request.
        */

        return res.status(500).json({ message: error });

      } else if (user) {

        /*
        409: the request could not be completed due to a conflict with the current
        state of the target resource. This code is used in situations where the
        user might be able to resolve the conflict and resubmit the request.
        */

        return res.status(409).json({ message: 'Login is already in use' });

      } else {

        var user = new User({
          id: UUID(),
          login: login,
          password: password,
          email: email,
          birthdate: req.body.birthdate,
          gender: req.body.gender,
          province: req.body.province
        });

        user.save((error) => {

          if (error) {

            return res.status(500).json({ message: error });

          } else {

            /*
            201: the request has been fulfilled and has resulted in
            one or more new resources being created.
            */

            return res.status(201).json({
              registeredUser: {
                id: user.id,
                login: user.login,
                email: user.email
              }
            });
          }
        });
      }
    });
  }
}

function get(req, res) {

  var offset = parseInt(req.query.offset) || 0, limit = parseInt(req.query.limit) || 100;

  User.find({}, '-_id -__v -password -admin')
      .limit(limit)
      .skip(offset)
      .exec((error, data) => {

        if (error) {

          return res.status(500).json({ message: error });

        } else {

          return res.status(200).json({ count: data.length, users: data });

        }
      });
};

function getUser(req, res) {

  var userId = req.params.userId;

  User.find({ id: userId }, '-_id -__v -password -admin')
      .exec((error, data) => {

        if (error) {

          return res.status(500).json({ message: error });

        } else {

          return res.status(200).json({ user: data });

        }
      });
};

function remove(req, res) {

  User.remove({ id: req.params.userId }, (error) => {

    if (error) {

      return res.status(500).json({ message: error });

    } else {

      return res.status(200).json({ message: 'User has been removed correctly' });

    }
  });
};

function update(req, res) {

  var userId = req.params.userId,
      newLogin = req.body.newLogin,
      newPassword = req.body.newPassword,
      currentPassword = req.body.currentPassword,
      newEmail = req.body.newEmail,
      newBirthdate = req.body.newBirthdate,
      newGender = req.body.newGender,
      newProvince = req.body.newProvince,
      update = {};

  if (!newLogin && !newPassword && !newEmail && !newBirthdate && !newGender && !newProvince) {

    return res.status(422).json({ success: false, message: 'Nothing to update' });

  } else {

    if (newPassword) { update.password = newPassword };

    if (newEmail) { update.email = newEmail };

    if (newBirthdate) { update.birthdate = newBirthdate };

    if (newGender) { update.gender = newGender };

    if (newProvince) { update.province = newProvince };

    if (newLogin) {

      User.findOne({ login: newLogin }, (error, user) => {

        if (error) {

          return res.status(500).json({ message: error });

        } else if (user) {

          return res.status(409).json({ message: 'Login is already in use' });

        } else {

          update.login = newLogin;

          findOneAndUpdate({ id: userId }, update, res);

        }
      });

    } else {

      findOneAndUpdate({ id: userId }, update, res);

    }
  }
};

function saveHistoryItem(req, res) {

  var ownerId = req.params.userId,
      websiteContent = req.body.websiteContent,
      url = req.body.url,
      parentUrl = req.body.parentUrl,
      connection = req.body.connection,
      date = req.body.date,
      timeSpent = req.body.timeSpent;

  Database.saveHistory({ ownerId, websiteContent, url, parentUrl, connection, date, timeSpent }, (error) => {

    if (error && error.errors) {

			return res.status(422).json({ message: error.errors });

 		} else if (error) {

      return res.status(500).json({ message: error });

    } else {

 			return res.status(201).json({ message: 'History record saved succesfully' });

 		}
  });
};

function getHistory(req, res) {

  var userId = req.params.userId,
      offset = parseInt(req.query.offset) || 0,
      limit = parseInt(req.query.limit) || 100;

  Database.getHistoryOfUser({ offset, limit, userId }, (error, data) => {

    if (error) {

      return res.status(500).json({ message: error });

    } else {

      return res.status(200).json({ count: data.length, data: data });

    }
  });
};

function removeHistoryItem(req, res) {

  var historyId = req.params.historyId;

  Database.removeHistory({ historyId }, (error) => {

    if (error) {

      return res.status(500).json({ message: error});

    } else {

      return res.status(200).json({ message: 'History item deleted successfully' });

    }
  });
};

module.exports = {
    register: register,
    get: get,
    getUser: getUser,
    remove: remove,
    update: update,
    saveHistoryItem: saveHistoryItem,
    getHistory: getHistory,
    removeHistoryItem: removeHistoryItem
};

function findOneAndUpdate(query, update, res) {

  User.findOneAndUpdate(query, update, (error, user) => {

    if (error) {

      return res.status(500).json({ message: error });

    } else if (!user) {

      return res.status(409).json({ message: 'User not found' });

    } else {

      return res.status(200).json({ message: 'User updated successfully'});

    }
  });
};

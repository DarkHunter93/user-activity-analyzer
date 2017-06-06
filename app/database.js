'use strict';

var User = require('./models/user');

function findOne(query, callback) {

  User.findOne(query, callback);
  History.findOne(query, callback);

};

module.exports = {
    findOne: findOne
};

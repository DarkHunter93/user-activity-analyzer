/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

function get(callback) {
    User.find({}, '-_id -__v -password -admin -rights -settings')
        .exec((error, data) => {
            if (error) {
                callback(createError(500, error.message));
            } else if (data) {
                callback(null, data);
            } else {
                callback(createError(500, 'Users not found'));
            }
        });
}

module.exports = get;

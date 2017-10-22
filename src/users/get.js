/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

function get(userId, callback) {
    User.find({ id: userId }, '-_id -__v -password -admin')
        .exec((error, user) => {
            if (error) {
                callback(createError(500, error.message));
            } else if (user.length !== 0) {
                callback(null, user[0]);
            } else {
                console.log("2");
                callback(createError(409, 'User not found'));
            }
        });
}

module.exports = get;

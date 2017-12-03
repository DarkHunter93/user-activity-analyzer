/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

function get(offset, limit, callback) {

    if (limit > 1000) {
        return callback(createError(409, 'Max limit is 1000'));
    }

    User.find({}, '-_id -__v -password -admin -rights -settings',
        {
            skip: offset,
            limit: limit
        })
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

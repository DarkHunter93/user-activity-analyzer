/**
 * Created by Kedzierski Dawid on 12.10.17.
 */

'use strict';

let createError = require('../createError'),
    UUID = require('uuid/v4'),
    User = require('../../models/user');

function create(user, callback) {
    User.findOne({ login: user.login }, (error, profiles) => {
        if (error) {

            /*
            500: the server encountered an unexpected condition that prevented it
            from fulfilling the request.
            */

            callback(createError(500, error.message));
        } else if (profiles) {

            /*
            409: the request could not be completed due to a conflict with the current
            state of the target resource. This code is used in situations where the
            user might be able to resolve the conflict and resubmit the request.
            */

            callback(createError(409, 'Login is already in use'));
        } else {
            let newUser = Object.assign(new User(), user);
            newUser.id = UUID();
            newUser.password = newUser.generateHash(user.password);
            newUser.save((error) => {
                if (error) {
                    callback(createError(500, error.message));
                } else {
                    callback();
                }
            });
        }
    });
}

module.exports = create;
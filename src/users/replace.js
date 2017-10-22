/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

//TODO raz działa, raz nie, nie wiem dlaczego, do sprawdzenia

function replace(userId, newUser, callback) {
    User.findOne({ login: newUser.login }, (error, user) => {
        if (error) {
            callback(createError(500, error.message));
        } else if (user && user.id !== userId) {
            callback(createError(409, 'Login is already in use'));
        } else {
            User.remove({ id: userId }, (error) => {
                if (error) {
                    callback(createError(500, error.message));
                } else {
                    newUser.id = userId;
                    User.create(newUser, (error) => {
                        if (error) {
                            callback(createError(500, error.message));
                        } else {
                            callback();
                        }
                    });
                }
            });
        }
    });
}

module.exports = replace;

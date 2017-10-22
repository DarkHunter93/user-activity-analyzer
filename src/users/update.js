/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

function updateProperty(userId, update, callback) {
    User.update({ id: userId }, { $set: update }, (error) => {
        if (error) {
            callback(createError(500, error.message));
        } else {
            callback();
        }
    });
}

function update(userId, update, callback) {

    if (update.id) delete update.id;
    if (update.admin) delete update.admin;

    if (update.login) {
        User.findOne({ login: update.login }, (error, user) => {
            if (error) {
                callback(createError(500, error.message));
            } else if (user) {
                callback(createError(409, 'Login is already in use'));
            } else {
                updateProperty(userId, update, callback);
            }
        });
    }

    updateProperty(userId, update, callback);
}

module.exports = update;

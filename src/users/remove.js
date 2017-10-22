/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

//TODO obsłużyć kolekcję history przy usuwaniu użytkownika

function remove(userId, callback) {
    User.remove({ id: userId }, (error) => {
        if (error) {
            callback(createError(500, error.message));
        } else {
            callback();
        }
    });
}

module.exports = remove;

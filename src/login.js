/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

'use strict';

const jwt = require('jsonwebtoken');

let User = require('../models/user'),
    tokenGenerator = require('./auth/TokenGenerator'),
    createError = require('./createError');

function login(username, password, callback) {
    User.findOne({ login: username }, 'id password rights', (error, user) => {
        if (error) {
            return callback(createError(500, error.message));
        } else if (!user) {
            return callback(createError(422, 'User not found'));
        } else if (!user.validPassword(password, user.password)) {
            return callback(createError(422, 'Wrong password'));
        } else {
            let token = tokenGenerator.sign({
                data: {
                    userId: user.id,
                    rights: user.rights
                }
            });

            return callback(null, { token: token, exp: jwt.decode(token).exp, userId: user.id });
        }
    });
}

module.exports = login;
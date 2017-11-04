/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

let authBasic = require('./authBasic'),
    refreshToken = require('./refreshToken');

module.exports = {
    basic: authBasic,
    refresh: refreshToken
};
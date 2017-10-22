/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    User = require('../../models/user');

function search(searchingProperty, callback) {
    User.find(searchingProperty, (error, data) => {
        console.log("WESZŁO");
        if (error) {
            callback(createError(500, error.message));
        } else if (data.length !== 0) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
}

module.exports = search;
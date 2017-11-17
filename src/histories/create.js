/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    UUID = require('uuid/v4'),
    History = require('../../models/history');

function create(historyItem, callback) {

    historyItem.id = UUID();

    History.create(historyItem, (error) => {
        if (error && error.errors) {
            callback(createError(422, JSON.stringify(error.errors)));
        } else if (error) {
            callback(createError(500, error.message));
        } else {
            callback();
        }
    });
}

module.exports = create;
/**
 * Created by Kedzierski Dawid on 03.12.17.
 */

'use strict';

let createError = require('../createError'),
    History = require('../../models/history');

//TODO check if everything works good when exclusion is null
function search(offset, limit, phrase, exclusion = null, callback) {

    History
        .find({ $text: { $search: `${phrase.join(' ')} ${exclusion.join(' ')}` }})
        .exec((error, data) => {
            if (error) {
                return callback(createError(500, error.message));
            } else {
                callback(null, data);
            }
        });
}

module.exports = search;
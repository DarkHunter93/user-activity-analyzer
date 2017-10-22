/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    History = require('../../models/history');

function get(offset, limit, sort, searchingProperties, callback) {

    if (sort === "DESC") {
        sort = -1;
    } else if (sort === "ASC") {
        sort = 1;
    } else {
        sort = -1;
    }

    History.find(searchingProperties, '-_id -__v', {
        skip: offset,
        limit: limit,
        sort: {
            date: sort
        }
    }).exec((error, data) => {
        if (error) {
            callback(createError(500, error.message));
        } else {
            callback(null, data);
        }
    });
}

module.exports = get;
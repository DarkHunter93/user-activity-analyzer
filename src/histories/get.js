/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

const queryString = require('querystring');

let createError = require('../createError'),
    History = require('../../models/history'),
    paging = require('../paging');

function get(offset, limit, sort, searchingProperties, pathName, callback) {

    if (sort === "ASC") {
        sort = 1;
    } else {
        sort = -1;
    }

    if (limit > 1000) {
        return callback(createError(409, 'Max limit is 1000'));
    }

    History.find(searchingProperties, '-_id -__v', {
        skip: offset,
        limit: limit,
        sort: {
            date: sort
        }
    }).exec((error, data) => {
        if (error) {
            return callback(createError(500, error.message));
        } else {
            return callback(null, paging(pathName, offset, limit, searchingProperties, data));
        }
    });
}

module.exports = get;
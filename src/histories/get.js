/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

const queryString = require('querystring');

let createError = require('../createError'),
    History = require('../../models/history'),
    paging = require('../paging');

//TODO zwracanie ilości rekordów w histories
//TODO zwracanie ilości użytkowników w bazie danych
//TODO websiteContent = true jako query

function get(offset, limit, sort, searchingProperties, pathName, callback) {

    // let keys = Object.keys(searchingProperties);
    // keys.forEach((item, index) => {
    //     if (index === 0) {
    //         return searchingProperties[key];
    //     } else {
    //         return ` AND ${searchingProperties[key]}`
    //     }
    // });

    if (sort === "ASC") {
        sort = 1;
    } else {
        sort = -1;
    }

    if (limit > 1000) {
        return callback(createError(409, 'Max limit is 1000'));
    }

    History.find(searchingProperties, `-_id -__v -websiteContent.urls`, {
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
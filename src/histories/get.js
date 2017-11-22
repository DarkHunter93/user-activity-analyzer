/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

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

//TODO użycie Promise

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
            History.count({}, (error, count) => {
                if (count > offset + limit) {
                    return callback(null, {
                        data: data,
                        count: data.length,
                        maxCount: count,
                        next: paging(pathName, offset, limit, searchingProperties)
                    });
                } else if (count) {
                    return callback(null, {
                        data: data,
                        count: data.length,
                        maxCount: count
                    });
                } else {
                    return callback(createError(500, 'Internal Server Error'));
                }
            });
        }
    });
}

module.exports = get;
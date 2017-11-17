/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    History = require('../../models/history');

function doMapping(data, aggregateBy, callback) {
    let newData = [];
    data.forEach((item) => {
        let newItem = {};
        newItem[aggregateBy] = item._id.url;
        newItem.count = item.count;
        newData.push(newItem);
    });
    callback(null, newData);
}

function getTop(offset, limit, aggregateBy, userId, callback) {

    /*
    The _id field is mandatory; however, you can specify an _id value
    of null to calculate accumulated values for all the input documents as a whole.
    */

    if (userId) {
        History.aggregate([
                { $match: { ownerId: `${userId}` } },
                { $group : {
                    _id: { url: `$${aggregateBy}` },
                    count: { $sum: 1 }
                }},
                { $sort : { count : -1 }},
                { $skip: offset },
                { $limit: limit }],
            (error, data) => {
                if (error) {
                    return callback(createError(500, error.message));
                } else {
                    doMapping(data, aggregateBy, callback);
                }
            }
        );
    } else {
        History.aggregate([
                { $group : {
                    _id: { url: `$${aggregateBy}` },
                    count: { $sum: 1 }
                }},
                { $sort : { count : -1 }},
                { $skip: offset },
                { $limit: limit }],
            (error, data) => {
                if (error) {
                    return callback(createError(500, error.message));
                } else {
                    doMapping(data, aggregateBy, callback);
                }
            }
        );
    }
}

module.exports = getTop;


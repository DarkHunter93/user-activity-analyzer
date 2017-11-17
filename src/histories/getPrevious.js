/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

'use strict';

let createError = require('../createError'),
    History = require('../../models/history');

//TODO opracować getPrevious dla indywidualnej strony (nie globalnie)
//TODO więcej możliwości dla matchBy i matchUrl

function getPrevious(limit, matchBy, matchUrl, callback) {
    let match = {};
    match[matchBy] = matchUrl;

    History.aggregate([
        { $match: match },
        { $limit: limit },
        { $group: {
            _id: { url: '$url.full', connectionTitle: '$connection.title', parentUrl: '$parentUrl.full' },
            count: { $sum: 1 }
        }},
        { $sort : { count : -1 }}],
        (error, data) => {
            if (error) {
                callback(createError(500, error.message));
            } else {
                callback(null, data);
            }
        }
    );
}

module.exports = getPrevious;


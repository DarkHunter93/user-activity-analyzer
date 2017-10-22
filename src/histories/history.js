/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

let create = require('./create'),
    get = require('./get'),
    getTop = require('./getTop'),
    getPrevious = require('./getPrevious');

module.exports = {
    get: get,
    getTop: getTop,
    getPrevious: getPrevious,
    create: create
};
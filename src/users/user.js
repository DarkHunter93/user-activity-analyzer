/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

let get = require('./get'),
    create = require('./create'),
    remove = require('./remove'),
    replace = require('./replace'),
    update = require('./update'),
    search = require('./search');

module.exports = {
    get: get,
    create: create,
    remove: remove,
    replace: replace,
    update: update,
    search: search
};
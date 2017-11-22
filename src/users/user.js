/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

let getUser = require('./getUser'),
    getUsers = require('./getUsers'),
    create = require('./create'),
    remove = require('./remove'),
    replace = require('./replace'),
    update = require('./update'),
    search = require('./search');

module.exports = {
    getUser: getUser,
    getUsers: getUsers,
    create: create,
    remove: remove,
    replace: replace,
    update: update,
    search: search
};
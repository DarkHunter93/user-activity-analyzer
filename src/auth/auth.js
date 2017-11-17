/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

let checkToken = require('./checkToken'),
    checkBasicRights = require('./checkBasicRights');

module.exports = {
    checkToken: checkToken,
    basic: checkBasicRights
};
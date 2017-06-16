var UUID      = require('uuid/v4');
var History   = require('./models/history');

function saveHistory(properties, callback) {

  History.create({
    id: UUID(),
 		ownerId: properties.ownerId,
    websiteContent: properties.websiteContent,
 		url: properties.url,
 		parentUrl: properties.parentUrl,
    connection: properties.connection,
 		date: properties.date
 	}, (error) => { callback(error) });

};

function getHistoryOfUser(properties, callback) {

  History.
    find({ ownerId: properties.userId }, '-_id -__v').
    limit(properties.limit).
    skip(properties.offset).
    exec((error, data) => { callback(error, data) });

};

function removeHistory(properties, callback) {

  History.remove({ id: properties.historyId }, (error) => { callback(error) });

}

module.exports = {
    saveHistory: saveHistory,
    getHistoryOfUser: getHistoryOfUser,
    removeHistory: removeHistory
};

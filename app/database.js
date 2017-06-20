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
 		date: properties.date,
    timeSpent: properties.timeSpent
 	}, (error) => { callback(error) });

};

function getHistoryOfUser(properties, callback) {

  History.
    find({ ownerId: properties.userId }, '-_id -__v').
    limit(properties.limit).
    skip(properties.offset).
    exec((error, data) => { callback(error, data) });

};

function getHistoryOfUsers(properties, callback) {

  History.
    find(properties.searchingProperties, '-_id -__v').
    limit(properties.limit).
    skip(properties.offset).
    exec((error, data) => { callback(error, data) });

};

function removeHistory(properties, callback) {

  History.remove({ id: properties.historyId }, (error) => { callback(error) });

};

function getTopWebsites(properties, callback) {

  /*
  The _id field is mandatory; however, you can specify an _id value
  of null to calculate accumulated values for all the input documents as a whole.
  */

  History.aggregate([
    { $group : {
      _id: { url: `$${properties.aggregateBy}` },
      count: { $sum: 1 }
    }},
    { $sort : { count : -1 }},
    { $skip: properties.offset },
    { $limit: properties.limit }],
    callback
  );

};

function getTopWebsitesOfUser(properties, callback) {

  /*
  The _id field is mandatory; however, you can specify an _id value
  of null to calculate accumulated values for all the input documents as a whole.
  */

  History.aggregate([
    { $match: { ownerId: `${properties.userId}` } },
    { $group : {
      _id: { url: `$${properties.aggregateBy}` },
      count: { $sum: 1 }
    }},
    { $sort : { count : -1 }},
    { $skip: properties.offset },
    { $limit: properties.limit }],
    callback
  );

};

module.exports = {
    saveHistory: saveHistory,
    getHistoryOfUser: getHistoryOfUser,
    getHistoryOfUsers: getHistoryOfUsers,
    removeHistory: removeHistory,
    getTopWebsites: getTopWebsites,
    getTopWebsitesOfUser: getTopWebsitesOfUser
};

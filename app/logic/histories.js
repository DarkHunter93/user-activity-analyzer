var UUID        = require('uuid/v4');
var History     = require('../models/history');
var Database    = require('../database');

// ########################
// ######### SAVE #########
// ########################

function save(req, res) {

  History.create({
    id: UUID(),
 		ownerId: req.decoded._doc.id,
    websiteContent: req.body.websiteContent,
 		url: req.body.url,
 		parentUrl: req.body.parentUrl,
    connection: req.body.connection,
 		date: req.body.date
 	}, (error) => {

 		if (error && error.errors) {

			return res.status(422).json({ message: error.errors });

 		} else if (error) {

      return res.status(500).json({ message: error });

    } else {

 			return res.status(201).json({ message: 'History record saved succesfully' });

 		}
  });

};

// ##########################
// ######### SEARCH #########
// ##########################

function search(req, res) {

  /*
  ########################################################
  Po wprowadzeniu OAuth2 można dawać użytkownikom różne
  prawa dostępu, np. użytkownikom indywidualnym pozwalamy
  na przeglądanie tylko własnej historii, a klientom
  biznesowym pozwalamy wyszukiwać tylko agregując dane.
  ########################################################
  */

  var offset = parseInt(req.query.offset) || 0,
      limit = parseInt(req.query.limit) || 100,
      searchingProperties = req.body.searchingProperties || {};

  Database.getHistoryOfUsers({ offset, limit, searchingProperties }, (error, data) => {

    if (error) {

      return res.status(500).json({ message: error });

    } else {

      return res.status(200).json({ count: data.length, data: data });

    }
  });

};

// ##########################
// ######### REMOVE #########
// ##########################

function remove(req, res) {

  var id = req.params.historyId;

  History.remove({ id: id }, (error) => {

    if (error) {

      return res.status(500).json({ message: error});

    } else {

      return res.status(200).json({ message: 'History item deleted successfully' });

    }
  });

};

// ##################################
// ######### getTopWebsites #########
// ##################################

function getTopWebsites(req, res) {

  var offset = parseInt(req.query.offset) || 0,
      limit = parseInt(req.query.limit) || 10,
      aggregateBy = req.query.aggregateBy || 'url.full';

  /*
  The _id field is mandatory; however, you can specify an _id value
  of null to calculate accumulated values for all the input documents as a whole.
  */

  Database.getTopWebsites({ offset, limit, aggregateBy }, (error, data) => {

      if (error) {

        return res.status(500).json({ message: error});

      } else {

        var response = [];

        data.forEach((item, index) => {

          var newItem = {};

          newItem[aggregateBy] = item._id.url;
          newItem.count = item.count;

          response.push(newItem);

        });

        return res.status(200).json({ success: true, data: response });

      }
  });
};

// ########################################
// ######### getTopWebsitesOfUser #########
// ########################################

function getTopWebsitesOfUser(req, res) {

  var userId = req.params.userId,
      offset = parseInt(req.query.offset) || 0,
      limit = parseInt(req.query.limit) || 10,
      aggregateBy = req.query.aggregateBy || 'url.full';

  Database.getTopWebsitesOfUser({ offset, limit, userId, aggregateBy }, (error, data) => {

      if (error) {

        return res.status(500).json({ message: error});

      } else {

        var response = [];

        data.forEach((item, index) => {

          var newItem = {};

          newItem[aggregateBy] = item._id.url;
          newItem.count = item.count;

          response.push(newItem);

        });

        return res.status(200).json({ success: true, data: response });

      }
  });
};

// #######################################
// ######### getPreviousWebsites #########
// #######################################

function getPreviousWebsites(req, res) {

  var limit = parseInt(req.body.limit) || 100;

  if (req.body.url) {

    History.aggregate([
      { $match: {
          'url.full': req.body.url
      }},
      { $limit: limit },
      { $group: {
        _id: { url: '$url.full', connectionTitle: '$connection.title', parentUrl: '$parentUrl.full' },
        count: { $sum: 1 }
      }}],
      (error, data) => {

        if (error) {

    			return res.status(500).json({ success: false, message: error});

     		} else {

     			return res.status(200).json({ success: true, data: data });

        }
      }
    );

  } else {

    return res.status(422).json({ success: false, message: `'url' is null or undefined` });

  }
};

module.exports = {
    save: save,
    search: search,
    remove: remove,
    getTopWebsites: getTopWebsites,
    getTopWebsitesOfUser: getTopWebsitesOfUser,
    getPreviousWebsites: getPreviousWebsites
};

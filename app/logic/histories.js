var UUID      = require('uuid/v4');
var History   = require('../models/history');

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

  var offset = parseInt(req.body.offset) || 0, limit = parseInt(req.body.limit) || 100;

  /*
  ########################################################
  Po wprowadzeniu OAuth2 można dawać użytkownikom różne
  prawa dostępu, np. użytkownikom indywidualnym pozwalamy
  na przeglądanie tylko własnej historii, a klientom
  biznesowym pozwalamy wyszukiwać tylko agregując dane.
  ########################################################
  */

  var searchingProperties = req.body.searchingProperties || {};

  if (searchingProperties) {

    History.
      find(searchingProperties, '-_id -__v').
      limit(limit).
      skip(offset).
      exec((error, data) => {

        if (error) {

          return res.status(500).json({ message: error });

        } else {

          /*
          ########################################################
          Wprowadzić mapowanie, ujednolicić nazwy dla użytkownika!
          ########################################################
          */

          return res.status(200).json({ data: data });

        }
      });

  } else {

    return res.status(422).json({ message: `'searchingProperties' is null or undefined.` });

  }

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
    }
  );

};

module.exports = {
    save: save,
    search: search,
    remove: remove,
    getTopWebsites: getTopWebsites
};

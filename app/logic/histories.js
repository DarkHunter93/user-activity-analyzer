var UUID        = require('uuid/v4');
var config      = require('../../config');
var History     = require('../models/history');
var Website     = require('../models/website');

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

  var searchingProperties = req.body.searchingProperties;

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

function save(req, res) {

  var websiteId = UUID();

  Website.create({
    id: websiteId,
    websiteContent: req.body.websiteContent
  }, (error) => {

    if (error && error.errors) {

			return res.status(422).json({ message: error.errors});

 		} else if (error) {

      return res.status(500).json({ message: error});

    } else {

      History.create({
     		ownerId: req.decoded._doc.id,
        websiteId: websiteId,
     		url: req.body.url,
     		parentUrl: req.body.parentUrl,
        connection: req.body.connection,
     		date: req.body.date
     	}, (error) => {

     		if (error && error.errors) {

    			return res.status(422).json({ message: error.errors});

     		} else if (error) {

          return res.status(500).json({ message: error});

        } else {

     			return res.status(201).json({ message: 'History record saved succesfully' });

     		}
      });
 		}
  });

};

function remove(req, res) {

  if (req.decoded._doc.admin == true) {

    if (req.body.id) {

      History.remove({ id: id }, (error) => {

        if (error) {

          return res.status(500).json({ success: false, message: error});

        } else {

          return res.status(200).json({ success: true, message: 'History item deleted successfully' });

        }
      });

    } else {

      return res.status(422).json({ success: false, message: `'id' is null or undefined` });

    }

  } else {

    /*
    403: The server understood the request but refuses to authorize it
    */

    return res.status(403).json({ success: true, message: `You don't have permission to perform this operation` });

  }

};

module.exports = {
    search: search,
    save: save,
    remove: remove
};

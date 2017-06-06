'use strict';

var UUID        = require('uuid/v4');
var config      = require('../../config');
var History     = require('../models/history');
var Website     = require('../models/website');

module.exports.setup = (app, logger) => {

/**
 * @swagger
 * /websites:
 *   get:
 *     description: Search visited websites
 *     tags: [Websites]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *         description: "Authorization token"
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: "Limit of search results. Default equal 100."
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: "Offset of search results. Default equal 0."
 *       - in: query
 *         name: q
 *         type: string
 *         required: false
 *         description: "Searching query"
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: History item deleted successfully
 *       409:
 *         description: The token is expired
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: The token is expired
 *       500:
 *         description: Internal Server Error
 */
app.get('/websites', (req, res) => {

  logger.info(JSON.stringify(req.body));

  var offset = parseInt(req.query.offset) || 0,
      limit = parseInt(req.query.limit) || 10,
      caseSensitive = req.query.caseSensitive || 0,
      strict = req.query.strict || 0,
      q = req.query.q;

  /*
  The _id field is mandatory; however, you can specify an _id value
  of null to calculate accumulated values for all the input documents as a whole.
 */

  if (q) {

    Website.find({}, '-_id -__v')
        .skip(offset)
        .limit(limit)
        .exec((error, data) => {

          if (error) {

            return res.status(500).json({ message: error });

          } else {

            console.log(`data.length: ${data.length}`);

            var response = [];
            var globalCount = 0;

            data.forEach((item, index) => {

              console.log(`index: ${index}`);

              var newItem = {};

              newItem.id = item.id;

              var patt2 = /Lorem/g;
              newItem.count = patt2.exec(item.websiteContent.text).length;
              console.log('newItem.count: ' + newItem.count);

              response.push(newItem);

              globalCount = globalCount + newItem.count;

            });

            return res.status(200).json({ count: globalCount, data: response });

          }
        });
  }
});

};

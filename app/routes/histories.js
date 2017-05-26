'use strict';

var config      = require('../../config');
var History     = require('../models/history');

module.exports.setup = (app, logger) => {

/**
 * @swagger
 * /histories/search:
 *   post:
 *     description: Save history of user's activity
 *     tags: [Histories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               require: true
 *             offset:
 *               type: number
 *               example: 10
 *               default: 0
 *               require: false
 *             limit:
 *               type: number
 *               example: 200
 *               default: 100
 *               require: false
 *             searchingProperties:
 *               type: object
 *               properties:
 *                 ownerId:
 *                   type: string
 *                   example: bb63cbf7-9bde-4e65-91eb-a128d4ce8c50
 *                   require: false
 *                 url.domain:
 *                   type: string
 *                   example: www.example.com
 *                   require: false
 *                 url.full:
 *                   type: string
 *                   example: www.example.com/books?id=666666
 *                   require: false
 *                 url.path:
 *                   type: string
 *                   example: /books
 *                   require: false
 *                 url.query:
 *                   type: object
 *                   example: {
 *                     id: 666666
 *                   }
 *                   require: false
 *                 url.protocol:
 *                   type: string
 *                   example: HTTPS
 *                   require: false
 *                 url.port:
 *                   type: number
 *                   example: 6000
 *                   require: false
 *                 parentUrl.domain:
 *                   type: string
 *                   example: www.google.com
 *                   require: false
 *                 parentUrl.full:
 *                   type: string
 *                   example: www.google.com/
 *                   require: false
 *                 parentUrl.path:
 *                   type: string
 *                   example: /
 *                   require: false
 *                 parentUrl.query:
 *                   type: object
 *                   require: false
 *                 parentUrl.protocol:
 *                   type: string
 *                   example: HTTPS
 *                   require: false
 *                 parentUrl.port:
 *                   type: number
 *                   example: 5876
 *                   require: false
 *                 time:
 *                   type: string
 *                   example: Fri May 26 2017 18:27:15 GMT+0200 (CEST)
 *                   required: false
 *               require: true
 *               description: Select only the properties you want to search
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data: array
 *       422:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "`searchingProperties` is null or undefined"
 *       500:
 *         description: Internal Server Error
 */
app.post('/histories/search', (req, res) => {

  logger.info(JSON.stringify(req.body));

  var offset = parseInt(req.body.offset) || 0, limit = parseInt(req.body.limit) || 100;

  var searchingProperties = req.body.searchingProperties;

  if (searchingProperties) {

    History.
      find(searchingProperties, '-_id -__v').
      limit(limit).
      skip(offset).
      exec((error, data) => {

        if (error) {

          return res.status(500).json({ success: false, message: error });

        } else {

          return res.status(200).json({ success: true, data: data });

        }
      });

    } else {

      return res.status(422).json({ success: false, message: `'searchingProperties' is null or undefined.` });

    }
});

/**
 * @swagger
 * /histories/save:
 *   post:
 *     description: Save history of user's activity
 *     tags: [Histories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: History object that needs to be added to the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               required: true
 *             url:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   example: www.example.com
 *                   require: true
 *                 full:
 *                   type: string
 *                   example: www.example.com/books?id=666666
 *                   require: true
 *                 path:
 *                   type: string
 *                   example: /books
 *                   require: false
 *                 query:
 *                   type: object
 *                   example: {
 *                     id: 666666
 *                   }
 *                   require: false
 *                 protocol:
 *                   type: string
 *                   example: HTTPS
 *                   require: false
 *                 port:
 *                   type: number
 *                   example: 6000
 *                   require: false
 *             parentUrl:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   example: www.google.com
 *                   require: false
 *                 full:
 *                   type: string
 *                   example: www.google.com/
 *                   require: false
 *                 path:
 *                   type: string
 *                   example: /
 *                   require: false
 *                 query:
 *                   type: object
 *                   require: false
 *                 protocol:
 *                   type: string
 *                   example: HTTPS
 *                   require: false
 *                 port:
 *                   type: number
 *                   example: 5876
 *                   require: false
 *               require: true
 *             connection:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   required: false
 *                 title:
 *                   type: string
 *                   required: false
 *             date:
 *               type: date
 *               example: Fri May 26 2017 18:27:15 GMT+0200 (CEST)
 *               required: false
 *     responses:
 *       201:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: History record saved succesfully
 *       422:
 *         description: required property is null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: object
 *               example: {
 *                 parentUrl: {
 *                   message: Path `parentUrl` is required.,
 *                   name: ValidatorError,
 *                   properties: {
 *                     type: required,
 *                     message: "Path `{PATH}` is required.",
 *                     path: parentUrl
 *                   },
 *                 kind: required,
 *                 path: parentUrl
 *                 }
 *               }
 *       500:
 *         description: Internal Server Error
 */
app.post('/histories/save', (req, res) => {

  logger.info(JSON.stringify(req.body));

  History.create({
 		ownerId: req.decoded._doc.id,
 		url: req.body.url,
 		parentUrl: req.body.parentUrl,
    connection: req.body.connection,
 		date: req.body.date
 	}, (error) => {

 		if (error && error.errors) {

			return res.status(422).json({ success: false, message: error.errors});

 		} else if (error) {

      return res.status(500).json({ success: false, message: error});

    } else {

 			return res.status(201).json({ success: true, message: 'History record saved succesfully' });

 		}

  });
});

/**
 * @swagger
 * /histories/getPreviousWebsites:
 *   post:
 *     description: Get previous users websites for specific url
 *     tags: [Histories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               required: true
 *             url:
 *               type: string
 *               example: www.example.com/books?id=666666
 *               required: true
 *             limit:
 *               type: number
 *               example: 200
 *               default: 100
 *               require: false
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             data:
 *               type: array
 *               example: [
 *                 {
 *                   "_id": {
 *                     "url": "www.example.com/books?id=666666",
 *                     "connectionTitle": "Zwierzenia jeżozwierza - buy book on sale",
 *                     "parentUrl": "www.google.com/search?q=example"
 *                   },
 *                 "count": 1
 *                 },
 *                 {
 *                   "_id": {
 *                     "url": "www.example.com/books?id=666666",
 *                     "connectionTitle": "Zwierzenia jeżozwierza - buy book",
 *                     "parentUrl": "www.google.com/search?q=example"
 *                   },
 *                   "count": 2
 *                 }
 *               ]
 *       422:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "`url` is null or undefined"
 *
 *       500:
 *         description: Internal Server Error
 */
app.post('/histories/getPreviousWebsites', (req, res) => {

  logger.info(JSON.stringify(req.body));

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
});

};

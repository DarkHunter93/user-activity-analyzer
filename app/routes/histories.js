'use strict';

var UUID        = require('uuid/v4');
var config      = require('../../config');
var History     = require('../models/history');
var Website     = require('../models/website');

var Histories   = require('../logic/histories');

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
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *         description: "Authorization token"
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: "Limit of users"
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: "Offset of users"
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             searchingProperties:
 *               type: object
 *               properties:
 *                 ownerId:
 *                   type: string
 *                   example: bb63cbf7-9bde-4e65-91eb-a128d4ce8c50
 *                   required: false
 *                 url.domain:
 *                   type: string
 *                   example: www.example.com
 *                   required: false
 *                 url.full:
 *                   type: string
 *                   example: www.example.com/books?id=666666
 *                   required: false
 *                 url.path:
 *                   type: string
 *                   example: /books
 *                   required: false
 *                 url.query:
 *                   type: object
 *                   example: {
 *                     id: 666666
 *                   }
 *                   required: false
 *                 url.protocol:
 *                   type: string
 *                   example: HTTPS
 *                   required: false
 *                 url.port:
 *                   type: number
 *                   example: 6000
 *                   required: false
 *                 parentUrl.domain:
 *                   type: string
 *                   example: www.google.com
 *                   required: false
 *                 parentUrl.full:
 *                   type: string
 *                   example: www.google.com/
 *                   required: false
 *                 parentUrl.path:
 *                   type: string
 *                   example: /
 *                   required: false
 *                 parentUrl.query:
 *                   type: object
 *                   required: false
 *                 parentUrl.protocol:
 *                   type: string
 *                   example: HTTPS
 *                   required: false
 *                 parentUrl.port:
 *                   type: number
 *                   example: 5876
 *                   required: false
 *                 time:
 *                   type: string
 *                   example: Fri May 26 2017 18:27:15 GMT+0200 (CEST)
 *                   required: false
 *               required: true
 *               description: Select only the properties you want to search
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: array
 *               description: Array of history items
 *       422:
 *         description: "`searchingProperties` is null or undefined"
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.post('/histories/search', Histories.search);

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
 *       - in: header
 *         name: token
 *         type: string
 *         required: true
 *         description: "Authorization token"
 *       - in: body
 *         name: body
 *         description: History object that needs to be added to the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   example: www.example.com
 *                   required: true
 *                 full:
 *                   type: string
 *                   example: www.example.com/books?id=666666
 *                   required: true
 *                 path:
 *                   type: string
 *                   example: /books
 *                   required: false
 *                 query:
 *                   type: object
 *                   example: {
 *                     id: 666666
 *                   }
 *                   required: false
 *                 protocol:
 *                   type: string
 *                   example: HTTPS
 *                   required: false
 *                 port:
 *                   type: number
 *                   example: 6000
 *                   required: false
 *             parentUrl:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   example: www.google.com
 *                   required: false
 *                 full:
 *                   type: string
 *                   example: www.google.com/
 *                   required: false
 *                 path:
 *                   type: string
 *                   example: /
 *                   required: false
 *                 query:
 *                   type: object
 *                   required: false
 *                 protocol:
 *                   type: string
 *                   example: HTTPS
 *                   required: false
 *                 port:
 *                   type: number
 *                   example: 5876
 *                   required: false
 *               required: true
 *             connection:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   required: false
 *                 title:
 *                   type: string
 *                   required: false
 *             websiteContent:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   example: "Lorem ipsum dolor sit amet enim. Etiam ullamcorper."
 *                   required: true
 *                 urls:
 *                   type: array
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
app.post('/histories/save', Histories.save);

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
 *               required: false
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

/**
 * @swagger
 * /histories/remove:
 *   post:
 *     description: Remove history record in database
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
 *             id:
 *               type: string
 *               example: 8ad0b41c-896e-43bd-bf9e-882f9162959e
 *               required: true
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: true
 *             message:
 *               type: string
 *               example: History item deleted successfully
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
 *       403:
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *               example: false
 *             message:
 *               type: string
 *               example: "You don't have permission to perform this operation"
 *       500:
 *         description: Internal Server Error
 */
app.delete('/histories', Histories.remove);

/**
 * @swagger
 * /histories/getTopWebsites:
 *   get:
 *     description: Get most visited websites
 *     tags: [Histories]
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
 *         description: "Limit of search results. Default equal 10."
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: "Offset of search results. Default equal 0."
 *       - in: query
 *         name: aggregateBy
 *         type: string
 *         required: false
 *         description: "Default by 'url.full'."
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
app.get('/histories/getTopWebsites', (req, res) => {

  logger.info(JSON.stringify(req.body));

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
});

}

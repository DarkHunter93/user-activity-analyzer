/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

// GET /histories
/**
 * @swagger
 * /histories:
 *   get:
 *     description: Search global history of every user activity
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
 *         description: Authorization token
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: Maximal count of history, default equal 100
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: Offset of returned history, default equal 0
 *       - in: query
 *         name: sort
 *         type: string
 *         required: false
 *         description: DESC or ASC
 *       - in: query
 *         name: "*******"
 *         type: string
 *         required: false
 *         description: Property you want to search
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

// POST /histories
/**
 * @swagger
 * /histories:
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
 *         description: Authorization token
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
 *       204:
 *         description: Ok
 *       422:
 *         description: Nothing to save or required property is null or undefined
 *       500:
 *         description: Internal Server Error
 */

// GET /histories/top
/**
 * @swagger
 * /histories/top:
 *   get:
 *     description: Get most visited websites of every user
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
 *         description: Authorization token
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: Maximal count of search results, default equal 10
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: Offset of search results, default equal 0
 *       - in: query
 *         name: aggregateBy
 *         type: string
 *         required: false
 *         description: "Default equal 'url.full'"
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

// GET /histories/previous
/**
 * @swagger
 * /histories/previous:
 *   get:
 *     description: Get previous websites for specific url
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
 *         description: Authorization token
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: Maximal count of search results, default equal 10
 *       - in: query
 *         name: matchBy
 *         type: string
 *         required: false
 *         description: "Default equal 'url.full'"
 *       - in: query
 *         name: matchUrl
 *         type: string
 *         required: true
 *         description: The url to search
 *     responses:
 *       200:
 *         description: Ok
 *       422:
 *         description: matchUrl is null or undefined
 *       500:
 *         description: Internal Server Error
 */
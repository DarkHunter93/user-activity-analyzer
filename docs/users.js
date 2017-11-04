/**
 * Created by Kedzierski Dawid on 22.10.17.
 */

// GET /users/:userId
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     description: Get info about user
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *     responses:
 *       200:
 *         description: Ok
 *       409:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

// POST /users
/**
 * @swagger
 * /users:
 *   post:
 *     description: Register user to the application
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User object that needs to be added to the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *               required: true
 *             password:
 *               type: string
 *               required: true
 *             email:
 *               type: string
 *               required: true
 *             birthdate:
 *               type: string
 *               format: date
 *               required: false
 *               example: "Thu Nov 10 2010 15:46:19 GMT+0100 (CET)"
 *             gender:
 *               type: string
 *               required: false
 *             province:
 *               type: string
 *               required: false
 *     responses:
 *       204:
 *         description: User registered successfully
 *       409:
 *         description: Login is already in use
 *       422:
 *         description: Login, password or email are null or undefined
 *       500:
 *         description: Internal Server Error
 */

// DELETE /users/:userId
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     description: Remove user from the application
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *     responses:
 *       200:
 *         description: User has been removed correctly
 *       500:
 *         description: Internal Server Error
 */

// PUT /users/:userId
/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     description: Upsert user account
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *       - in: body
 *         name: body
 *         description: User object that need to be upserted in the database
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *               required: true
 *             password:
 *               type: string
 *               required: true
 *             email:
 *               type: string
 *               required: true
 *             birthdate:
 *               type: string
 *               format: date
 *               required: false
 *               example: "Thu Nov 10 2010 15:46:19 GMT+0100 (CET)"
 *             gender:
 *               type: string
 *               required: false
 *             province:
 *               type: string
 *               required: false
 *     responses:
 *       200:
 *         description: User updated successfully
 *       409:
 *         description: Login is already in use
 *       422:
 *         description: Login, password or email are null or undefined
 *       500:
 *         description: Internal Server Error
 */

// PATCH /users/:userId
/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     description: Update some property of user account
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *       - in: body
 *         name: body
 *         description: Properties of user that need to be updated in the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *             password:
 *               type: string
 *             email:
 *               type: string
 *             birthdate:
 *               type: string
 *               format: date
 *               example: "Thu Nov 10 2010 15:46:19 GMT+0100 (CET)"
 *             gender:
 *               type: string
 *             province:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       409:
 *         description: Login is already in use
 *       422:
 *         description: Nothing to update
 *       500:
 *         description: Internal Server Error
 */

// GET /users/:userId/histories
/**
 * @swagger
 * /users/{userId}/histories:
 *   get:
 *     description: Search history of user's activity
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: query
 *         name: limit
 *         type: number
 *         required: false
 *         description: "Maximal count of history, default equal 100"
 *       - in: query
 *         name: offset
 *         type: number
 *         required: false
 *         description: "Offset of returned history, default equal 0"
 *       - in: query
 *         name: sort
 *         type: string
 *         required: false
 *         description: DESC or ASC
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

// GET /users/:userId/histories/top
/**
 * @swagger
 * /users/{userId}/histories/top:
 *   get:
 *     description: Get most visited websites of user
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
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
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */

// GET /users/search
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     description: Get info about user
 *     tags: [Users]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: X-Access-Token
 *         type: string
 *         required: true
 *         description: Authorization token
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: ID of user
 *       - in: query
 *         name: login
 *         type: string
 *         required: false
 *         description: Check if login exist already
 *     responses:
 *       200:
 *         description: Ok
 *       409:
 *         description: Too many properties
 *       422:
 *         description: Nothing to search
 *       500:
 *         description: Internal Server Error
 */
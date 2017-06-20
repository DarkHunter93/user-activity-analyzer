var Users       = require('../logic/users');
var Auth        = require('../logic/authentication');

module.exports.setup = function(app) {

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
 *             gender:
 *               type: string
 *               required: false
 *             province:
 *               type: string
 *               required: false
 *     responses:
 *       201:
 *         description: User registered successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 login:
 *                   type: string
 *                 email:
 *                   type: string
 *       409:
 *         description: Login is already in use
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       422:
 *         description: Login, password or email are null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.post('/users', Users.register);

app.use(Auth.authentication);

/**
 * @swagger
 * /users:
 *   get:
 *     description: Get array of users objects
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               description: Number of returned users
 *               example: 2
 *             users:
 *               type: array
 *               description: Array of users objects
 *               example: [
 *                 {
 *                   "id": "73988969-49f6-48a8-9ec0-02d552ca24d8",
 *                   "login": "Madonna",
 *                   "email": "queen@madonna.com"
 *                 },
 *                 {
 *                   "id": "f31a47cc-6184-468f-9109-cb929bd39bea",
 *                   "login": "Client",
 *                   "email": "Client@gmail.com"
 *                 }
 *               ]
 *       500:
 *         description: Internal Server Error
 */
app.get('/users', Users.get);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     description: Get array of users objects
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               description: Number of returned users
 *               example: 2
 *             users:
 *               type: array
 *               description: Array of users objects
 *               example: [
 *                 {
 *                   "id": "73988969-49f6-48a8-9ec0-02d552ca24d8",
 *                   "login": "Madonna",
 *                   "email": "queen@madonna.com"
 *                 },
 *                 {
 *                   "id": "f31a47cc-6184-468f-9109-cb929bd39bea",
 *                   "login": "Client",
 *                   "email": "Client@gmail.com"
 *                 }
 *               ]
 *       500:
 *         description: Internal Server Error
 */
app.get('/users/:userId', Users.getUser);

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
 *         name: token
 *         type: string
 *         required: true
 *         description: "Authorization token"
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *         description: "ID of user"
 *     responses:
 *       200:
 *         description: User has been removed correctly
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.delete('/users/:userId', Users.remove);

/**
 * @swagger
 * /users/{userId}:
 *   patch:
 *     description: Update user account
 *     tags: [Users]
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
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *       - in: body
 *         name: body
 *         description: Properties of user that need to be updated in the database
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newLogin:
 *               type: string
 *             newPassword:
 *               type: string
 *             newEmail:
 *               type: string
 *             newBirthdate:
 *               type: string
 *               format: date
 *               example: "Thu Nov 10 2010 15:46:19 GMT+0100 (CET)"
 *             newGender:
 *               type: string
 *             newProvince:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       409:
 *         description: Login is already in use
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       422:
 *         description: None of the properties (newLogin, newPassword, newEmail, ...) have been sent
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Nothing to update
 *       500:
 *         description: Internal Server Error
 */
app.patch('/users/:userId', Users.update);

/**
 * @swagger
 * /users/{userId}/histories:
 *   post:
 *     description: Save history of user's activity
 *     tags: [Users]
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
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
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
app.post('/users/:userId/histories', Users.saveHistoryItem);

/**
 * @swagger
 * /users/{userId}/histories:
 *   get:
 *     description: Get user's history
 *     tags: [Users]
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
 *     responses:
 *       200:
 *         description: Ok
 *         schema:
 *           type: object
 *           properties:
 *             count:
 *               type: number
 *               description: "Number of items in 'data' array"
 *             data:
 *               type: array
 *               description: Array of history items
 *       500:
 *         description: Internal Server Error
 */
app.get('/users/:userId/histories', Users.getHistory);

/**
 * @swagger
 * /users/{userId}/histories/{historyId}:
 *   delete:
 *     description: Remove history record in database
 *     tags: [Users]
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
 *       - in: path
 *         name: userId
 *         type: string
 *         required: true
 *       - in: path
 *         name: historyId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: History item deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.delete('/users/:userId/histories/:historyId', Users.removeHistoryItem);

}

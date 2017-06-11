'use strict';

var Users       = require('../logic/users');

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

// the JWT authentication middleware authenticates callers using a JWT
// app.use((req, res, next) => {
//
// 	var token = req.get('Authorization') || req.body.token || req.query.token;
//
//   if (token) {
//
// 		JWT.verify(token, app.get('superSecret'), (error, decoded) => {
//
//       if (error) {
//
//         switch(error.name) {
//
//           case 'TokenExpiredError':
//
//             return res.status(409).json({ success: false, message: 'The token is expired' });
//
//           case 'JsonWebTokenError':
//
//             return res.status(500).json({ success: false, message: error.message });
//
//           default:
//
//             return res.status(500).json({ success: false, message: 'Unknown server error 0002' });
//         }
//
// 			} else {
//
//         User.findOne({
//           login: decoded._doc.login,
//           password: decoded._doc.password,
//           email: decoded._doc.email
//         }, (error, user) => {
//
//           if (error) {
//
//             return res.status(500).json({ success: false, message: error });
//
//           } else if (!user) {
//
//             return res.status(409).json({ message: 'The token is expired' });
//
//           } else {
//
//             req.decoded = decoded;
//     				next();
//
//           }
//         });
//       }
// 		});
//
// 	} else {
//
// 		return res.status(422).json({ message: 'No token provided' });
//
// 	}
// });

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

}

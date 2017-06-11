var Login = require('../logic/login');

module.exports.setup = function(app) {

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login user to the application
 *     tags: [Login]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Login and password of user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             login:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Token is valid for 12 hours
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       409:
 *         description: Wrong password or user not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       422:
 *         description: Login or password are null or undefined
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       500:
 *         description: Internal Server Error
 */
app.post('/login', Login.login);

}

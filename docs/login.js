/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

// POST /login
/**
 * @swagger
 * /login:
 *   post:
 *     description: Sign in the user
 *     tags: [Login]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User credentials
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
 *     responses:
 *       200:
 *         description: User logged successfully
 *       422:
 *         description: User not found or wrong password
 *       500:
 *         description: Internal Server Error
 */
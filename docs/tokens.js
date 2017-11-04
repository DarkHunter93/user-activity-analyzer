/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

// GET /tokens/:userId
/**
 * @swagger
 * /tokens/{userId}:
 *   get:
 *     description: Refresh token
 *     tags: [Tokens]
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
 *       204:
 *         description: Token refreshed successfully
 *       500:
 *         description: Internal Server Error
 */
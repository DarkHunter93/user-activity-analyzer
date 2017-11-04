/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

'use strict';

var jwt = require('jsonwebtoken');

function authBasic(req, res, next) {
    let token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'secret', (error, decoded) => {
            if (error) {
                switch(error.name) {
                    case 'TokenExpiredError':
                        return res.status(409).json({ message: 'Token is expired' });
                        break;
                    case 'JsonWebTokenError':
                        return res.status(500).json({ message: error.message });
                        break;
                    default:
                        return res.status(500).json({ message: 'Decoding token error' });
                }
            } else {
                if ((decoded.data.rights.basic === true && decoded.data.userId === req.params.userId)
                    || decoded.data.rights.admin === true) {
                    next();
                } else {
                    return res.status(401).json({message: 'No rights for execution this operation'})
                }
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
}

module.exports = authBasic;

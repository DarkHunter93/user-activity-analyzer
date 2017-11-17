/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

'use strict';

const jwt = require('jsonwebtoken'),
    tokenGenerator = require('./TokenGenerator');

try {
    var config = require('../../config');
}
catch (e) {
    console.error('Cannot find config.js');
}

let JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;

function checkToken(req, res, next) {
    let token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (error, decoded) => {
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
                let refreshToken = tokenGenerator.refresh(token);
                res.set('X-Token', refreshToken);
                res.set('Expires', jwt.decode(refreshToken).exp);
                req.user = decoded.data;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
}

module.exports = checkToken;

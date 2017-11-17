/**
 * Created by Kedzierski Dawid on 17.11.17.
 */

'use strict';

let User = require('../../models/user');

function checkExtendedRights(req, res, next, rights) {
    if (rights && rights.basic && rights.basic === true) {
        return next();
    } else {
        return res.status(401).json({message: 'No rights for execution this operation'});
    }
}

function checkRights(req, res, next) {
    // if token is not required on path
    if (!req.user) {
        let userId = req.params.userId || req.body.userId;

        if (userId) {
            User.findOne({ userId: userId }, (error, user) => {
                if (error) {
                    return res.sendStatus(500);
                } else if (user) {
                    checkExtendedRights(req, res, next, user.rights);
                } else {
                    return res.status(409).json({ message: 'User not found' });
                }
            })
        }

    // if token is required on path
    } else {
        checkExtendedRights(req, res, next, req.user.rights);
    }
}

module.exports = checkRights;
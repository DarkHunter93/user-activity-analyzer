'use strict';

const express = require('express'),
    login = require('../src/login'),
    router = express.Router();

router.post('/', (req, res) => {
    if (req.body.login && req.body.password) {
        login(req.body.login, req.body.password, (error, data) => {
            if (data) {
                res.set('X-Token', data.token);
                res.set('Expires', data.exp);
                res.status(200).json({ userId: data.userId });
            } else if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Unknown error' });
            }
        });
    } else {
        res.status(422).json({ message: 'Login or password are null or undefined' });
    }
});

module.exports = router;
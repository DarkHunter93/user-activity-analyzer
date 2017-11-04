'use strict';

const express = require('express'),
    router = express.Router();

let tokenGenerator = require('../src/auth/TokenGenerator');

router.post('/', (req, res) => {
    let token = tokenGenerator.sign({
        data: {
            userId: '51963fbd-8259-427e-8cf7-50b4bd3b381a',
            rights: {
                basic: true,
                admin: false
            }
        }
    });

    if (token) {
        console.log(token);
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

module.exports = router;
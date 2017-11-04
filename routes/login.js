'use strict';

const express = require('express'),
    router = express.Router();

var jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    let token = jwt.sign({
        data: {
            userId: '51963fbd-8259-427e-8cf7-50b4bd3b381a',
            rights: {
                basic: true,
                admin: false
            }
        }
    }, 'secret', { expiresIn: '1h' });

    if (token) {
        console.log(token);
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

module.exports = router;
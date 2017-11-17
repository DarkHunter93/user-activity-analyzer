/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

'use strict';

const express = require('express'),
    auth = require('../src/auth/auth'),
    router = express.Router();

router.get('/:userId', [auth.checkToken, auth.basic], (req, res) => {
    res.sendStatus(204);
});

module.exports = router;
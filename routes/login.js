'use strict';

const express = require('express'),
    router = express.Router();

router.post('/', (req, res) => {
    res.status(200).json({ message: 'That resource will be available soon' });
});

module.exports = router;
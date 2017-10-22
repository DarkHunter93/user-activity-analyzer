'use strict';

const express = require('express'),
    swagger = require('swagger-jsdoc'),
    router = express.Router();

let docs = swagger({
    swaggerDefinition: {
        info: {
            title: 'User Activity Analyzer',
            version: '0.5.3'
        },
        host: 'user-activity-analyzer.herokuapp.com',
        basePath: '/',
    },
    apis: ['./docs/users.js','./docs/histories.js'],
});

router.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(docs);
});

module.exports = router;
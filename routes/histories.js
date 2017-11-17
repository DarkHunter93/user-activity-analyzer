'use strict';

const express = require('express'),
    history = require('../src/histories/history'),
    auth = require('../src/auth/auth'),
    router = express.Router();

router.get('/', (req, res) => {
    let offset = parseInt(req.query.offset) || 0,
        limit = parseInt(req.query.limit) || 100,
        sort = req.query.sort || -1,
        request = req;

    if (req.query.offset) delete request.query.offset;
    if (req.query.limit) delete request.query.limit;
    if (req.query.sort) delete request.query.sort;

    history.get(offset, limit, sort, request.query, req.originalUrl, (error, data) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({
                count: data.length,
                data: data.data,
                next:  data.next });
        }
    });
});

router.post('/', [auth.checkToken, auth.basic], (req, res) => {
    if (req.body) {
        history.create(req.body, (error) => {
            if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.sendStatus(204);
            }
        });
    } else {
        res.status(422).json({ message: 'Nothing to save' });
    }
});

router.get('/top', (req, res) => {
    let offset = parseInt(req.query.offset) || 0,
        limit = parseInt(req.query.limit) || 10,
        aggregateBy = req.query.aggregateBy || 'url.full',
        request = req;

    if (req.query.offset) delete request.query.offset;
    if (req.query.limit) delete request.query.limit;

    history.getTop(offset, limit, aggregateBy, null, req.originalUrl, (error, data) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({ data: data });
        }
    });
});

//TODO stronicowanie dla /previous

router.get('/previous', (req, res) => {
    let limit = parseInt(req.query.limit) || 100,
        matchBy = req.query.matchBy || 'url.full';

    if (req.query.matchUrl) {
        history.getPrevious(limit, matchBy, req.query.matchUrl, (error, data) => {
            if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.json({ data: data });
            }
        });
    } else {
        res.status(422).json({ message: 'matchUrl is null or undefined' });
    }
});

module.exports = router;
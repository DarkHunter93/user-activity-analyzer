'use strict';

//TODO DELETE /history

const express = require('express'),
    user = require('../src/users/user'),
    history = require('../src/histories/history'),
    auth = require('../src/auth/auth'),
    router = express.Router();

router.get('/search', (req, res) => {
    if (Object.keys(req.query).length === 1 && req.query.login) {
        console.log(req.query);
        user.search(req.query, (error, isFound) => {
            if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.json({ isFound: isFound });
            }
        });
    } else if (Object.keys(req.query).length > 1) {
        res.status(409).json({ message: 'Too many properties' });
    } else if (!req.query.login) {
        res.status(409).json({ message: 'For now, only login property is available to search' });
    } else {
        res.status(422).json({ message: 'Nothing to search' });
    }
});

router.get('/:userId', auth.basic, (req, res) => {
    user.get(req.params.userId, (error, user) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({ user: user });
        }
    });
});

router.post('/', (req, res) => {
    if (req.body.login && req.body.password && req.body.email) {
        user.create({
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            province: req.body.province
        }, (error) => {
            if (!error) {
                res.sendStatus(204);
            } else {
                res.status(error.status).json({ message: error.message });
            }
        });
    } else {
        res.status(422).json({ message: 'Login, password or email are null or undefined' });
    }
});

router.delete('/:userId', auth.basic, (req, res) => {
    user.remove(req.params.userId, (error) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({ message: 'User has been removed correctly' })
        }
    });
});

router.put('/:userId', auth.basic, (req, res) => {
    if (req.body.login && req.body.password && req.body.email) {
        user.replace(req.params.userId, req.body, (error) => {
            if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.json({ message: 'User updated successfully' })
            }
        });
    } else {
        res.status(422).json({ message: 'Login, password or email are null or undefined' });
    }
});

router.patch('/:userId', auth.basic, (req, res) => {
    if (req.body) {
        user.update(req.params.userId, req.body, (error) => {
            if (error) {
                res.status(error.status).json({ message: error.message });
            } else {
                res.json({ message: 'User updated successfully' })
            }
        });
    } else {
        res.status(422).json({ message: 'Nothing to update' });
    }
});

router.get('/:userId/histories', auth.basic, (req, res) => {
    let offset = parseInt(req.query.offset) || 0,
        limit = parseInt(req.query.limit) || 10,
        sort = req.query.sort || -1;

    history.get(offset, limit, sort, { ownerId: req.params.userId }, (error, data) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({ count: data.length, data: data });
        }
    });
});

router.get('/:userId/histories/top', auth.basic, (req, res) => {
    let offset = parseInt(req.query.offset) || 0,
        limit = parseInt(req.query.limit) || 10,
        aggregateBy = req.query.aggregateBy || 'url.full';

    history.getTop(offset, limit, aggregateBy, req.params.userId, (error, data) => {
        if (error) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.json({ data: data });
        }
    });
});

router.delete('/:userId/histories', auth.basic, (req, res) => {
    res.json({ message: 'Without authentication resource is unavailable' });
});

module.exports = router;
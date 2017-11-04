/**
 * Created by Kedzierski Dawid on 04.11.17.
 */

'use strict';

const jwt = require('jsonwebtoken');

try {
    var config = require('../../config');
}
catch (e) {
    console.error('Cannot find config.js');
}

let JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET,
    TOKEN_EXP = process.env.TOKEN_EXP || config.TOKEN_EXP;

function TokenGenerator (secretOrPrivateKey, secretOrPublicKey, options) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options;
}

TokenGenerator.prototype.sign = function(payload, signOptions) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

TokenGenerator.prototype.refresh = function(token) {
    const payload = jwt.verify(token, this.secretOrPublicKey);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({ }, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
};

let tokenGenerator = new TokenGenerator(JWT_SECRET, JWT_SECRET, { algorithm: 'HS256', keyid: '1', noTimestamp: false, expiresIn: TOKEN_EXP, notBefore: '2s' });

module.exports = tokenGenerator;
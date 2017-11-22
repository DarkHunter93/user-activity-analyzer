/**
 * Created by Kedzierski Dawid on 17.11.17.
 */

'use strict';

const queryString = require('querystring');

function paging(pathName, offset, limit, searchingProperties) {

    let next = `${pathName}?offset=${offset+limit}&limit=${limit}`;

    if (Object.keys(searchingProperties).length !== 0) {
        next += `&${queryString.stringify(searchingProperties)}`;
    }

    return next;
}

module.exports = paging;
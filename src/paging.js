/**
 * Created by Kedzierski Dawid on 17.11.17.
 */

'use strict';

function paging(pathName, offset, limit, searchingProperties, data) {
    let next = `${pathName}?offset=${offset+limit}&limit=${limit}`;

    if (Object.keys(searchingProperties).length !== 0) {
        next += `&${queryString.stringify(searchingProperties)}`;
    }

    if (data.length !== 0 && data.length === limit) {
        return {
            length: data.length,
            data: data,
            next: next
        };
    } else {
        return {
            length: data.length,
            data: data
        };
    }
}

module.exports = paging;
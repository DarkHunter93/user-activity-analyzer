/**
 * Created by Kedzierski Dawid on 25.07.17.
 */

'use strict';

function createError(status, message) {
    let error = new Error(message);
    error.status = status;
    return error;
}

module.exports = createError;
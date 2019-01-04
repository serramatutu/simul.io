const buckets = require('buckets-js');

function arrayToSet(array) {
    let s = new buckets.Set();
    array.forEach(val => {
        s.add(val);
    });

    return s;
}

module.exports = arrayToSet;
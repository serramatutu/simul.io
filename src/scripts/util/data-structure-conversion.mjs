import buckets from 'buckets-js';

function arrayToSet(array) {
    let s = new buckets.Set();
    array.forEach(val => {
        s.add(val);
    });

    return s;
}

export {arrayToSet};
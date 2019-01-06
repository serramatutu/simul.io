import buckets from 'buckets-js';

/**
 * Casts a normal array as a @type {buckets.Set};
 * @param {Array} array the array to be used
 */
function arrayToSet(array) {
    let s = new buckets.Set();
    array.forEach(val => {
        s.add(val);
    });

    return s;
}
export { arrayToSet };

/**
 * Casts a normal object as a @type {buckets.Dictionary};
 * @param {object} obj the object to be used
 */
function objectToDictionary(obj) {
    let d = new buckets.Dictionary();
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            d.set(prop, obj[prop]);
    }

    return d;
}
export { objectToDictionary };
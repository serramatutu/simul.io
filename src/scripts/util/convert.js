import buckets from 'buckets-js';

/**
 * Casts a normal array as a @type {buckets.Set};
 * @param {Array|buckets.Set} array the array or set to be used
 */
function arrayToSet(array) {
    if (array instanceof buckets.Set)
        return array;

    let s = new buckets.Set();
    array.forEach(val => {
        s.add(val);
    });

    return s;
}
export { arrayToSet };

/**
 * Casts a normal object as a @type {buckets.Dictionary};
 * @param {object|buckets.Dictionary} obj the object or dictionary to be used
 */
function objectToDictionary(obj) {
    if (obj instanceof buckets.Dictionary)
        return obj;

    let d = new buckets.Dictionary();
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop))
            d.set(prop, obj[prop]);
    }

    return d;
}
export { objectToDictionary };
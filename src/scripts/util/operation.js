import buckets from 'buckets-js';
import _ from 'underscore';
import * as convert from './convert';

/**
 * Generate a name to the object.
 * @param {Object} obj 
 * @param {string} [name] the name to be used. If not given, generates an unique ID
 */
function generateName(obj, name) {
    return obj.constructor.name + ':' + (name || _.uniqueId());
}

export { generateName };

/**
 * Attepts to access a position of an n-dimensional array. If it results in an error, returns the default value
 * @param {Array(Array(...))} arr the array to be accessed
 * @param {*} defaultValue the default value if the position is invalid
 * @param {number} arguments the indexes
 */
function get(arr, defaultValue) {
    var argsIdx = 2,
        v = arr;
    while(_.isArray(v)) {
        let idx = arguments[argsIdx++];
        if (idx < 0 || idx >= v.length)
            return defaultValue;
        v = v[idx];
    }

    return v;
}

export { get };

/**
 * Maps every element in s to a new form described by func
 * @param {Array|buckets.Set} s the original container
 * @param {function(Object):*} func the mapping function
 * @returns {Array|buckets.Set} the mapped container
 */
function map(s, func) {
    var ret = null;
    if (s instanceof Array || s instanceof buckets.Set){
        ret = new Array();
        s.forEach(val => {
            ret.push(func(val));
        });

        if (s instanceof buckets.Set)
            ret = convert.arrayToSet(ret);
    }

    return ret;
}

export { map };

/**
 * Checks whether a string is null or empty
 * @param {string} s the string to be tested
 */
function isNullOrEmpty(s) {
    return s === null || s === undefined || s === '';
}

export { isNullOrEmpty };


/**
 * Gets a hashcode from a string
 * @param {string} s the string to be hashed
 * @returns {number} the hashcode for this string
 */
function hashString(s) {
    var hash = 0, i, chr;
    if (s.length === 0) 
        return hash;
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export { hashString };

/**
 * Hashes an object based on its properties
 * @param {Object} o the object to be hashed
 * @returns {number} the object hash
 */
function hashObject(o) {
    var s = '';
    _.each(o, (value, key) => {
        s += value + key;
    });

    return hashString(s);
}

export { hashObject };
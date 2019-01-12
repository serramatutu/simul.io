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
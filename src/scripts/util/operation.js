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
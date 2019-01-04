import buckets from 'buckets-js';
import * as convert from './convert';

/**
 * 
 * @param {Object} obj the object to be looped through
 * @param {function(propName, propvalue):*} callback the callback function. Returing false is optional
 * if breaking from the loop is desired.
 */
function foreachProperty(obj, callback) {
    for (let prop in obj) {
        if (!obj.hasOwnProperty(prop))
            continue;
        if (callback(prop, obj[prop]) === false)
            break;
    }
}

export { foreachProperty };

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
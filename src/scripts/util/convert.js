import buckets from 'buckets-js';

/**
 * Converts a Hex color into an RGBA color
 * @param {number} hex the hex color value
 * @returns {Array(3)} array with values R, G, B, A in order
 */
function hexToRgba(hex) {
    return[
        (hex & 0xFF000000) >> 24,
        (hex & 0x00FF0000) >> 16,
        (hex & 0x0000FF00) >> 8,
        (hex & 0x000000FF)
    ];
}

export { hexToRgba };

/**
 * Converts an RGBA color into an hex color
 * @param {Array(3)} rgba array with values R, G, B, A in order
 * @returns {number} the hex color number
 */
function rgbaToHex(rgba) {
    return rgba[0] << 24 | rgba[1] << 16 | rgba[2] << 8 | rgba[3];
}

export { rgbaToHex };

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
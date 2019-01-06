import buckets from 'buckets-js';

/**
 * Converts a Hex color into an RGB color
 * @param {number} hex the hex color value
 * @returns {Array(2)} array with values R, G, B in order
 */
function hexToRgb(hex) {
    return[
        (hex & 0xFF0000) >> 16,
        (hex & 0x00FF00) >> 8,
        hex & 0x0000FF
    ];
}

export { hexToRgb };

/**
 * Converts an RGB color into an hex color
 * @param {Array(2)} rgb array with values R, G, B in order
 * @returns {number} the hex color number
 */
function rgbToHex(rgb) {
    return rgb[0] << 16 | rgb[1] << 8 | rgb[2];
}

export { rgbToHex };

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
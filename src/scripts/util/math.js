import { hexToRgb, rgbToHex } from './convert';

/**
 * Interpolates between two colors based on a transition value
 * @param {number} start the first hex color
 * @param {number} end the last hex color
 * @param {number([0;1])} t the interpolation factor 
 */
function lerpColor(start, end, t) {
    let startRgb = hexToRgb(start),
        endRgb = hexToRgb(end);
    
    return rgbToHex([
        startRgb[0] + (endRgb[0] - startRgb[0]) * t,
        startRgb[1] + (endRgb[1] - startRgb[1]) * t,
        startRgb[2] + (endRgb[2] - startRgb[2]) * t
    ]);
}

export { lerpColor };
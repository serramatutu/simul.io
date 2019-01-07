import { hexToRgba, rgbaToHex } from './convert';

/**
 * Interpolates between two colors based on a transition value
 * @param {number} start the first hex color
 * @param {number} end the last hex color
 * @param {number([0;1])} t the interpolation factor 
 */
function lerpColor(start, end, t) {
    let startRgba = hexToRgba(start),
        endRgba = hexToRgba(end);
    
    return rgbaToHex([
        endRgba[0] + (startRgba[0] - endRgba[0]) * t,
        endRgba[1] + (startRgba[1] - endRgba[1]) * t,
        endRgba[2] + (startRgba[2] - endRgba[2]) * t,
        endRgba[3] + (startRgba[3] - endRgba[3]) * t
    ]);
}

export { lerpColor };
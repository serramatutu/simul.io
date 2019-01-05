/**
 * Generates a random id string.
 * @param {number} size the string size
 * @returns {string} a random alphanumeric string with the specified size
 */
function makeId(size = 8) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export { makeId };
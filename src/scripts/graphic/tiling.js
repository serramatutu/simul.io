import * as PIXI from 'pixi.js';
import _ from 'underscore';
import * as op from '../util/operation';

const TILE_SIZE = 16;

export { TILE_SIZE };

/**
 * Makes TileOrientations much more human readable
 * 
 * The tile id is calculated like this:
 * 001  002 004
 * 008  xxx 016
 * 032  064 128
 * 
 * If the tile we're trying to calculate is 'xxx',
 * then it's ID sum will be the sum of the existing neighbor
 * values.
 * 
 * If needed, the tile id's can be calculated using
 * the tile_id_calculator.py script
 * @enum
 */
var TileOrientation = {
    // main tiles
    TOP_LEFT: 208,
    TOP: 248,
    TOP_RIGHT: 104,
    LEFT: 214,
    CENTER: 255,
    RIGHT: 107,
    BOTTOM_LEFT: 22,
    BOTTOM: 31,
    BOTTOM_RIGHT: 11,

    // short horizontal tiles
    THUMB_RIGHT: 16,
    THUMB_HORIZ_CONNECTOR: 24,
    THUMB_LEFT: 8,

    // short vertical tiles
    THUMB_TOP: 2,
    THUMB_VERT_CONNECTOR: 66,
    THUMB_BOTTOM: 64,

    // point tiles
    POINT: 0,

    // inset curves
    INSET_TOP_LEFT: 127,
    INSET_TOP_RIGHT: 223,
    INSET_BOTTOM_LEFT: 251,
    INSET_BOTTOM_RIGHT: 254
};
Object.freeze(TileOrientation);

export { TileOrientation };

/**
 * Defines the tile image position in the tilemap
 * based on it's type ID.
 * 
 * Structure: {
 *      id: [row, col]
 * }
 * @enum
 */
var TileCoordMap = {
    // basic tile configuration
    [TileOrientation.TOP_LEFT]:              [0, 0],
    [TileOrientation.TOP]:                   [0, 1],
    [TileOrientation.TOP_RIGHT]:             [0, 2],
    [TileOrientation.LEFT]:                  [1, 0],
    [TileOrientation.CENTER]:                [1, 1],
    [TileOrientation.RIGHT]:                 [1, 2],
    [TileOrientation.BOTTOM_LEFT]:           [2, 0],
    [TileOrientation.BOTTOM]:                [2, 1],
    [TileOrientation.BOTTOM_RIGHT]:          [2, 2],

    // short horizontal tiles
    [TileOrientation.THUMB_RIGHT]:           [3, 0],
    [TileOrientation.THUMB_HORIZ_CONNECTOR]: [3, 1],
    [TileOrientation.THUMB_LEFT]:            [3, 2],

    // short vertical tiles
    [TileOrientation.THUMB_TOP]:             [0, 3],
    [TileOrientation.THUMB_VERT_CONNECTOR]:  [1, 3],
    [TileOrientation.THUMB_BOTTOM]:          [2, 3],

    // point tiles
    [TileOrientation.POINT]:                 [3, 3],

    // inset curves
    [TileOrientation.INSET_TOP_LEFT]:        [0, 4],
    [TileOrientation.INSET_TOP_RIGHT]:       [0, 5],
    [TileOrientation.INSET_BOTTOM_LEFT]:     [1, 4],
    [TileOrientation.INSET_BOTTOM_RIGHT]:    [1, 5]
};
Object.freeze(TileCoordMap);

export { TileCoordMap };

/**
 * Gets a texture for a single tile
 * @param {Array(Array(bool))} tileMatrix a tile incidence matrix
 * @param {number} x the target tile's x position in the matrix
 * @param {number} y the target tile's y position in the matrix
 * @returns {number} the TileOrientation for the tile at (x, y)
 */
function getOrientation(tileMatrix, x = 1, y = 1) {
    // ugliest thing in the world, but this saves us
    // from having a for loop with unnecessarily complex
    // logic inside of it
    var id = 0;
    if (op.get(tileMatrix, false, x-1, y-1)) id += 1;
    if (op.get(tileMatrix, false, x, y-1))   id += 2;
    if (op.get(tileMatrix, false, x+1, y-1)) id += 4;
    if (op.get(tileMatrix, false, x-1, y))   id += 8;
    if (op.get(tileMatrix, false, x+1, y))   id += 16;
    if (op.get(tileMatrix, false, x-1, y+1)) id += 32;
    if (op.get(tileMatrix, false, x, y+1))   id += 64;
    if (op.get(tileMatrix, false, x+1, y+1)) id += 128;

    return id;
}

export { getOrientation };

/**
 * Gets the bounding box for a single tile texture based on TILE_SIZE
 * @param {number} the TileOrientation
 * @returns {PIXI.Rectangle} the bounding box
 */
function frameFromOrientation(orientation) {
    var atlasCoords = TileCoordMap[orientation];
    return new PIXI.Rectangle(atlasCoords[1] * TILE_SIZE, 
        atlasCoords[0] * TILE_SIZE, 
        TILE_SIZE, 
        TILE_SIZE);
}

export { frameFromOrientation };

/**
 * An object containing shared PIXI.Texture instances, indexed like the following
 * {
 *      baseTexName: {
 *          orientation: texture
 *      }
 * }
 */
var TEXTURES = {};

function initializeTextures(loader, resources) {
    var regex = new RegExp('.tileset');
    var sheet = resources['./assets/spritesheet.json'].spritesheet;

    _.each(sheet.textures, (texture, name) => {
        if (regex.test(name)) { // if the loaded resource is marked as a tileset
            TEXTURES[name] = {};
            for (var orientation in TileCoordMap) {
                TEXTURES[name][orientation] = new PIXI.Texture(
                    texture, frameFromOrientation(orientation)
                );
            }
        }
    });

    Object.freeze(TEXTURES);
}

PIXI.loader.onComplete.add(initializeTextures);

export { TEXTURES };
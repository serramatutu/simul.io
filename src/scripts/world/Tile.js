import * as PIXI from 'pixi.js';
import * as util from '../util/util';
import * as tiling from '../graphic/tiling';

class Tile {
    constructor(x, y, interactionProfile, ecofactorVars, baseTexturePath) {
        this._interactionProfile = interactionProfile;
        this._ecofactorVars = util.convert.objectToDictionary(ecofactorVars);
        this._x = x;
        this._y = y;
        this._baseTexturePath = baseTexturePath;
        this._orientation = tiling.TileOrientation.CENTER;
        this._sprite = new PIXI.Sprite(tiling.TEXTURES[baseTexturePath][this._orientation]);

        this._sprite.x = this._x * tiling.TILE_SIZE;
        this._sprite.y = this._y * tiling.TILE_SIZE;
        this._sprite.anchor.set(0.5, 0.5);
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._x;
    }

    get interactionProfile() {
        return this._interactionProfile;
    }

    get orientation() {
        return this._orientation;
    }

    set orientation(o) {
        this._orientation = o;
        this._sprite.texture = tiling.TEXTURES[this._baseTexturePath][o];
    }

    get sprite() {
        return this._sprite;
    }

    getEcofactorValue(name) {
        var fac = this._ecofactorVars.get(name);
        return (fac.max - fac.min) * fac.value + fac.min;
    }

    update(deltaTime) {
        var ecofactorValues = this._interactionProfile.update(deltaTime, this._ecofactorVars);
        this._ecofactorVars.forEach((name, obj) => {
            obj.value = ecofactorValues.get(name);
        });
    }
}

export default Tile;
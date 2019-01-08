import * as PIXI from 'pixi.js';
import * as util from '../util/util';

class Tile {
    constructor(x, y, interactionProfile, ecofactorVars, texturePath) {
        this._interactionProfile = interactionProfile;
        this._ecofactorVars = util.convert.objectToDictionary(ecofactorVars);
        this._x = x;
        this._y = y;
        this._sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(texturePath));
        this._sprite.x = this._x * Tile.TILE_SIZE;
        this._sprite.y = this._y * Tile.TILE_SIZE;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._x;
    }

    get sprite() {
        return this._sprite;
    }
    get interactionProfile() {
        return this._interactionProfile;
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

Tile.TILE_SIZE = 8;

export default Tile;
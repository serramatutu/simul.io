import * as util from '../util/util';

class Tile {
    constructor(x, y, interactionProfile, ecofactorVars) {
        this._interactionProfile = interactionProfile;
        this._ecofactorVars = util.convert.objectToDictionary(ecofactorVars);
        this._x = x;
        this._y = y;
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

    getEcofactorValue(name) {
        var fac = this._ecofactorVars.get(name);
        return (fac.max - fac.min) * fac.value + fac.min;
    }

    get color() {
        return util.math.lerpColor(0x00000000, 0xFFFFFFFF, this.getEcofactorValue('SUNLIGHT'));
    }

    update(deltaTime) {
        var ecofactorValues = this._interactionProfile.update(deltaTime, this._ecofactorVars);
        this._ecofactorVars.forEach((name, obj) => {
            obj.value = ecofactorValues.get(name);
        });
    }
}

export default Tile;
import * as util from '../util/util';

class Tile {
    constructor(x, y, interactionProfile, ecoFactorBoundaries, startInterpolations) {
        this._interactionProfile = interactionProfile;
        this._ecofactorBoundaries = ecoFactorBoundaries;
        this._ecoFactorInterpolations = util.convert.objectToDictionary(startInterpolations);
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

    get defaultEcofactorValues() {
        return this._defaultEcofactorValues;
    }

    getEcofactorValue(name) {
        var min = this._ecofactorBoundaries[name].min,
            max = this._ecofactorBoundaries[name].max,
            interp = this._ecoFactorInterpolations.get(name);
        return (max - min) * interp + min;
    }

    get color() {
        // TODO: Temporary
        return util.math.lerpColor(0x000000, 0xFFFFFF, this.getEcofactorValue('SUNLIGHT'));
    }

    update(deltaTime) {
        this._ecoFactorInterpolations = this._interactionProfile.update(deltaTime, this._ecoFactorInterpolations);
    }
}

export default Tile;
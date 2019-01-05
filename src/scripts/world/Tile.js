import { convert } from '../util/util';

class Tile {
    constructor(x, y, interactionProfile, defaultEcofactorValues) {
        this._interactionProfile = interactionProfile;
        this._defaultEcofactorValues = convert.arrayToSet(defaultEcofactorValues);
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
}

export default { Tile };
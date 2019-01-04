import { EcoFactor } from './EcoFactor.js'

class Tile {
    constructor(x, y, defaultEcoFactors) {
        this._x = x;
        this._y = y;
        
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._x;
    }
}

export default Tile;
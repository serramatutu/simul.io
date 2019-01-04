import Tile from './Tile.mjs';

class World {
    constructor(width = 1, height = 1) {
        if (width <= 0 || height <= 0)
            throw new Error('Invalid world size');
        this._width = width;
        this._height = height;

        this._worldMatrix = new Array(this._width);
        for (let i=0; i<this._width; i++) {
            this._worldMatrix[i] = new Array(this._height);
            for (let j=0; j<this._height; j++)
                this._worldMatrix[i][j] = new Tile(i, j, {});
        }
    }
};

export default { World };
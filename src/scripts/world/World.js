import { DesertBiome } from './presets/Biomes';
import * as PIXI from 'pixi.js';

class World {
    constructor(width = 1, height = 1) {
        if (width <= 0 || height <= 0)
            throw new Error('Invalid world size');
        this._width = width;
        this._height = height;

        this._container = new PIXI.Container();
        this._container.interactive = true;

        // TODO: Temporary
        this._worldMatrix = new DesertBiome().initialize(width, height);

        for (let i=0; i<this._width; i++) {
            for (let j=0; j<this._height; j++) {
                this._container.addChild(this._worldMatrix[i][j].sprite);
            }
        } 
    }

    get matrix() {
        return this.matrix;
    }

    get container() {
        return this._container;
    }

    update(deltaTime) {
        for (let i=0; i<this._width; i++) {
            for (let j=0; j<this._height; j++) {
                this._worldMatrix[i][j].update(deltaTime);
            }    
        } 
    }
}

export default World;
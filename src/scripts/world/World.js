import { DesertBiome } from './presets/Biomes';
import * as PIXI from 'pixi.js';

class World {
    constructor(width = 1, height = 1) {
        if (width <= 0 || height <= 0)
            throw new Error('Invalid world size');
        this._width = width;
        this._height = height;

        // TODO: Temporary
        this._container = new PIXI.Graphics();

        // TODO: Temporary
        this._worldMatrix = new DesertBiome().initialize(width, height);
    }

    get matrix() {
        return this.matrix;
    }

    get pixiContainer() {
        return this._container;
    }

    update(deltaTime) {
        for (let i=0; i<this._width; i++)
            for (let j=0; j<this._height; j++)
                this._worldMatrix[i][j].update(deltaTime);

        this._container.beginFill(this._worldMatrix[0][0].color);
        this._container.drawRect(0, 0, 100, 100);
    }
}

export default World;
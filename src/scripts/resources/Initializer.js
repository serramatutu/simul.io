import * as PIXI from 'pixi.js';

var Initializer = {
    loadAssets: function(callback) {
        PIXI.loader
            .add('./assets/spritesheet.json')
            .load(callback);
    }
};

export default Initializer;
import * as PIXI from 'pixi.js';
import * as mathUtils from '../util/math';
import tuning from '../../tuning';

//TODO: Camera movement relative to zoom
class Camera extends PIXI.Container {
    constructor(options) {
        super();
        this._screenWidth = options.screenWidth;
        this._screenHeight = options.screenHeight;
        this.snapToWorld = options.snapToWorld || true;

        this._uiContainer = new PIXI.Container;
        this._uiContainer.pivot.set(this._uiContainer.width/2, this._uiContainer.height/2);
        
        this._worldContainer = options.worldContainer;    
        this._worldContainer.x = 0;
        this._worldContainer.y = 0;

        this.addChild(this._worldContainer);
        this.addChild(this._uiContainer);
        this.moveCenter();
    }

    get uiContainer() {
        return this._uiContainer;
    }

    get worldContainer() {
        return this._worldContainer;
    }

    get worldScreenWidth() {
        return this._screenWidth / this.scale.x;
    }

    get worldScreenHeight() {
        return this._screenHeight / this.scale.y;
    }

    get x() {
        return this._worldContainer.x;
    }

    set x(x) {
        this._worldContainer.x = x;
        this.snap();
    }

    get y() {
        return this._worldContainer.y;
    }

    set y(y) {
        this._worldContainer.y = y;
        this.snap();
    }

    get zoom() {
        return this.scale.x;
    }

    set zoom(zoom) {
        var scale = mathUtils.clamp(zoom, tuning.MIN_CAMERA_SCALE, tuning.MAX_CAMERA_SCALE);
        this.scale.set(scale, scale);
        this.moveCenter();
    }

    moveCenter() {
        this.position.x = this.worldScreenWidth / 2 * this.scale.x;
        this.position.y = this.worldScreenHeight / 2 * this.scale.y;
    }

    snap() {
        if (this.snapToWorld) {
            this._worldContainer.x = mathUtils.clamp(this._worldContainer.x, -this._worldContainer.width, 0);
            this._worldContainer.y = mathUtils.clamp(this._worldContainer.y, -this._worldContainer.height, 0);
        }
    }
}

export default Camera;
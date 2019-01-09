import * as PIXI from 'pixi.js';
import * as mathUtils from '../util/math';
import tuning from '../../tuning';

//TODO: Camera movement relative to zoom
class Camera {
    constructor(worldContainer) {
        this._uiContainer = new PIXI.Container;
        this._uiContainer.pivot.set(this._uiContainer.width/2, this._uiContainer.height/2);
        
        this._worldContainer = worldContainer;

        // facilitates zooming A LOT
        this._cameraContainer = new PIXI.Container;
        this._cameraContainer.addChild(worldContainer);
        this._cameraContainer.x = this._cameraContainer.width/2;
        this._cameraContainer.y = this._cameraContainer.height/2;
        this._cameraContainer.pivot.set(this._cameraContainer.width/2, this._cameraContainer.height/2);
        

        this._worldContainer.x = this._worldContainer.width/2;
        this._worldContainer.y = this._worldContainer.height/2;
        this._worldContainer.pivot.set(this._worldContainer.width/2, this._worldContainer.height/2);
    }

    get uiContainer() {
        return this._uiContainer;
    }

    get worldContainer() {
        return this._worldContainer;
    }

    get container() {
        return this._cameraContainer;
    }

    left(amt = 1) {
        this._worldContainer.x += amt/this._cameraContainer.scale.x;
    }

    right(amt = 1) {
        this.left(-amt);
    }

    up(amt = 1) {
        this._worldContainer.y += amt/this._cameraContainer.scale.y;
    }

    down(amt = 1) {
        this.up(-amt);
    }

    zoomIn(amt = 1) {
        this._cameraContainer.scale.x = mathUtils.clamp(this._cameraContainer.scale.x + amt, 
            tuning.MIN_CAMERA_SCALE, tuning.MAX_CAMERA_SCALE);
        this._cameraContainer.scale.y = mathUtils.clamp(this._cameraContainer.scale.y + amt, 
            tuning.MIN_CAMERA_SCALE, tuning.MAX_CAMERA_SCALE);
    }

    zoomOut(amt = 1) {
        this.zoomIn(-amt);
    }
}

export default Camera;
import * as PIXI from 'pixi.js';
import * as mathUtils from '../util/math';
import tuning from '../../tuning';

//TODO: Camera movement relative to zoom
class Camera {
    constructor(worldContainer) {
        this._uiContainer = new PIXI.Container;
        this._worldContainer = worldContainer;
    }

    get uiContainer() {
        return this._uiContainer;
    }

    get worldContainer() {
        return this._worldContainer;
    }

    left(amt = 1) {
        this._worldContainer.x += amt;
    }

    right(amt = 1) {
        this.left(-amt);
    }

    up(amt = 1) {
        this._worldContainer.y += amt;
    }

    down(amt = 1) {
        this.up(-amt);
    }

    zoomIn(amt = 1) {
        this._worldContainer.scale.x = mathUtils.clamp(this._worldContainer.scale.x + amt, 
            tuning.MIN_CAMERA_SCALE, tuning.MAX_CAMERA_SCALE);
        this._worldContainer.scale.y = mathUtils.clamp(this._worldContainer.scale.y + amt, 
            tuning.MIN_CAMERA_SCALE, tuning.MAX_CAMERA_SCALE);
    }

    zoomOut(amt = 1) {
        this.zoomIn(-amt);
    }
}

export default Camera;
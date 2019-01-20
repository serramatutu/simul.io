import globals from '../resources/globals';
import * as mathUtils from '../util/math';

class CameraController {
    constructor(camera = globals.camera,  
        gameEvents = globals.events) {
        this._camera = camera;
        this._gameEvents = gameEvents;
        this._velocity = CameraController.DEFAULT_VELOCITY;
        this._zoomVel = CameraController.DEFAULT_ZOOM_VELOCITY;

        this._subscribe();
    }

    get velocity() {
        return this._velocity;
    }

    set velocity(v) {
        if (typeof v !== 'number')
            throw new Error('velocity must be a number');
        this._velocity = v;
    }

    get zoomVelocity() {
        return this._zoomVel;
    }

    set zoomVelocity(v) {
        if (typeof v !== 'number')
            throw new Error('zoom velocity must be a number');
        this._zoomVel = v;
    }

    _subscribe() {
        [
            'CAMERA_LEFT',
            'CAMERA_RIGHT',
            'CAMERA_UP',
            'CAMERA_DOWN',
            'CAMERA_ZOOM_IN',
            'CAMERA_ZOOM_OUT'
        ].forEach(eventName => {
            this._gameEvents.on(eventName, (deltaTime) => {
                var v = deltaTime * this._velocity,
                    z = deltaTime * this._zoomVel;
                v = mathUtils.clamp(v/this._camera.zoom, v/5, v*5);

                switch(eventName) {
                case 'CAMERA_LEFT'     : this._camera.x += v; break;
                case 'CAMERA_RIGHT'    : this._camera.x -= v; break;
                case 'CAMERA_UP'       : this._camera.y += v; break;
                case 'CAMERA_DOWN'     : this._camera.y -= v; break;
                case 'CAMERA_ZOOM_IN'  : this._camera.zoom += z; break;
                case 'CAMERA_ZOOM_OUT' : this._camera.zoom -= z; break;
                }
            });
        });
    }
}

/**
 * How the camera moves in pixels per frame (60 FPS)
 */
CameraController.DEFAULT_VELOCITY = 5;

/**
 * How intense the velocity change is according to zoom change
 */
CameraController.VELOCITY_MAX_SCALE = 5;

/**
 * How the camera moves in scale factor per frame (60 FPS)
 */
CameraController.DEFAULT_ZOOM_VELOCITY = 0.05;

export default CameraController;
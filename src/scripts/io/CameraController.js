import globals from '../resources/globals';

class CameraController {
    constructor(camera = globals.camera,  
        controls = globals.controls) {
        this._camera = camera;
        this._controls = controls;
        this._velocity = CameraController.DEFAULT_VELOCITY;
        this._zoomVel = CameraController.DEFAULT_ZOOM_VELOCITY;

        this._state = {};
        this._resetState();
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

    _resetState() {
        this._state.CAMERA_LEFT = 
        this._state.CAMERA_RIGHT =
        this._state.CAMERA_UP =
        this._state.CAMERA_DOWN =
        this._state.CAMERA_ZOOM_IN =
        this._state.CAMERA_ZOOM_OUT = false;
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
            this._controls.on(eventName, (evt) => {
                this._state[eventName] = evt.type == 'keydown';
            });
        });
        
        
        
    }

    update(deltaTime) {
        var v = (deltaTime/1000) * this._velocity,
            z = (deltaTime/1000) * this._zoomVel;
        if (this._state.CAMERA_LEFT)     this._camera.left(v);
        if (this._state.CAMERA_RIGHT)    this._camera.right(v);
        if (this._state.CAMERA_UP)       this._camera.up(v);
        if (this._state.CAMERA_DOWN)     this._camera.down(v);
        if (this._state.CAMERA_ZOOM_IN)  this._camera.zoomIn(z);
        if (this._state.CAMERA_ZOOM_OUT) this._camera.zoomOut(z);
    }
}

/**
 * How the camera moves in pixels per second
 */
CameraController.DEFAULT_VELOCITY = 1000;

CameraController.DEFAULT_ZOOM_VELOCITY = 10;

export default CameraController;
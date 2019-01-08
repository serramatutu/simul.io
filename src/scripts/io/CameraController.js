import globals from '../resources/globals';

class CameraController {
    constructor(domElem = globals.pixiApp.view,
        camera = globals.camera,  
        controlsProfile = globals.controlsProfile) {
        this._domElem = domElem;
        this._camera = camera;
        this._controls = controlsProfile;
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
        // TODO: DOMEventManager. This is just for testing
        this._domElem.addEventListener('keydown', (evt) => {
            var controlName = globals.controlsProfile.getControl(evt.key.toUpperCase());
            if (this._state.hasOwnProperty(controlName))
                this._state[controlName] = true;
        });

        this._domElem.addEventListener('keyup', (evt) => {
            var controlName = globals.controlsProfile.getControl(evt.key.toUpperCase());
            if (this._state.hasOwnProperty(controlName))
                this._state[controlName] = false;
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
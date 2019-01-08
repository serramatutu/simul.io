import _ from 'underscore';

class ControlsProfile {
    constructor(custom = {}) {
        // Maps the value to its key. Eg: 'CAMERA_UP': 'A'
        this._controlMappings = new Map;
        // Maps the key to its value. Eg: 'A': 'CAMERA_UP'
        this._keyMappings = new Map;
        _.each(ControlsProfile.DEFAULT_CONTROLS, (key, controlName) => {
            var mappedKey = custom[controlName] || key;
            this._controlMappings.set(controlName, mappedKey);
            this._keyMappings.set(mappedKey, controlName);
        });
    }

    /**
     * Finds the control mapped to the key
     * @param {string} key
     */
    getControl(key) {
        return this._keyMappings.get(key);
    }

    /**
     * Finds the key mapped to the control
     * @param {string} controlName 
     */
    getKey(controlName) {
        return this._controlMappings.get(controlName);
    }

    /**
     * Remaps a control to a new key
     * @param {string} controlName 
     * @param {string} key 
     */
    set(controlName, key) {
        this._controlMappings.set(controlName, key);
        this._keyMappings.set(key, controlName);
    }
}

ControlsProfile.DEFAULT_CONTROLS = {
    CAMERA_LEFT:     'A',
    CAMERA_RIGHT:    'D',
    CAMERA_UP:       'W',
    CAMERA_DOWN:     'S',
    CAMERA_ZOOM_IN:  '[',
    CAMERA_ZOOM_OUT: ']'
};

export default ControlsProfile;
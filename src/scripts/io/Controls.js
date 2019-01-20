import _ from 'underscore';
import globals from '../resources/globals';

/**
 * Facilitates binding events through method cascading
 * 
 * Event specification:
 * - keyhold: whenever a key is being held down for some time
 * - keydown: whenever a key is being pressed down
 * - keyup: whenever a key has been released
 */
class Action {
    keyup(keys, targets) {
        return this._pushKeyEvent('keyup', keys, targets);
    }

    keydown(keys, targets) {
        return this._pushKeyEvent('keydown', keys, targets);
    }

    keyhold(keys, targets) {
        return this._pushKeyEvent('keyhold', keys, targets);
    }

    _pushKeyEvent(eventName, keys, targets) {
        var keysArray = [];
        for (let i=0; i<keys.length; i++)
            keysArray.push(keys.charAt(i));
        
        var params = [];
        keysArray.forEach(key => {
            params.push({
                key: key,
                targets: new Set(targets)
            });
        });

        this._pushEvent('dom', eventName, params);

        return this;
    }

    _pushEvent(eventType, eventName, eventParams) {
        if (!this[eventType])
            this[eventType] = {};
        if (!this[eventType][eventName])
            this[eventType][eventName] = [];

        eventParams.forEach(params => {
            this[eventType][eventName].push(params);
        });
    }
}

/**
 * Action factory for syntax sugar
 */
function action() {
    return new Action();
}

/**
 * Provides an abstaction to commands given to the window through
 * events based on command triggers.
 */
class Controls {
    /**
     * Constructs the controls object
     * @param {Object} custom command customizations
     * @example
     * var custom = {
     *      // maps DO_SOMETHING command to 'pointerover' action onto the player and 'a' keydown onto the window
     *      DO_SOMETHING: {
     *          dom: {
     *              keydown: [
     *                  {
     *                      key: 'a'
     *                  }
     *              ]
     *          },
     *          game: {
     *              pointerover: [{
     *                  targets: ['player']
     *              }]
     *          }
     *      }
     * }
     * var c = Controls(custom);
     */
    constructor(gameEventEmitter = globals.events, custom = {}) {
        this._eventEmitter = gameEventEmitter;

        this._prevDown = new Set;
        this._down = new Set;

        this._domActions = new Map;
        // this._gameActions = new Map;

        _.each(Controls.DEFAULT_CONTROLS, (actionObject, controlName) => {
            this.set(controlName, custom[controlName] || actionObject);
        });

        this._setupListeners();
    }

    _setupListeners() {
        window.addEventListener('keydown', e => {
            this._down.add(e.key);
        });

        window.addEventListener('keyup', e => {
            this._down.delete(e.key);
        });
    }

    /**
     * Remaps a control to a new action.
     * @param {string} controlName 
     * @param {string} actionObject 
     */
    set(controlName, actionObject) {
        _.each(actionObject.dom, (actions, actionName) => {
            actions.forEach(action => {
                if (!this._domActions.has(actionName))
                    this._domActions.set(actionName, new Set);
                action.controlName = controlName;
                this._domActions.get(actionName).add(action);
            });
        });
    }

    _emitEvents(deltaTime, evtName, check) {
        let s = this._domActions.get(evtName);
        if (!s) return;

        s.forEach(action => {
            if (check(action))
                this._eventEmitter.emit(action.controlName, deltaTime);
        });
    }

    update(deltaTime) {
        this._emitEvents(deltaTime, 'keyhold', action => {
            return this._prevDown.has(action.key);
        });

        this._emitEvents(deltaTime, 'keydown', action => {
            return this._down.has(action.key);
        });

        this._emitEvents(deltaTime, 'keyup', action => {
            return this._prevDown.has(action.key) && !this._down.has(action.key);
        });

        for (let key of this._down)
            this._prevDown.add(key);

        for (let key of this._prevDown) {
            if (!this._down.has(key))
                this._prevDown.delete(key);
        }
    }
}

/**
 * Maps control names to their default actions
 */
Controls.DEFAULT_CONTROLS = {
    CAMERA_LEFT:     action().keydown('a'),
    CAMERA_RIGHT:    action().keydown('d'),
    CAMERA_UP:       action().keydown('w'),
    CAMERA_DOWN:     action().keydown('s'),
    CAMERA_ZOOM_IN:  action().keydown('['),
    CAMERA_ZOOM_OUT: action().keydown(']')
};

export default Controls;
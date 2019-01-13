import _ from 'underscore';
import globals from '../resources/globals';

/**
 * Facilitates binding events through method cascading
 */
class Action {
    key(keys, targets) {
        this.keydown(keys, targets);
        return this.keyup(keys, targets);
    }

    keypress(keys, targets) {
        return this._pushKeyEvent('keypress', keys, targets);
    }

    keyup(keys, targets) {
        return this._pushKeyEvent('keyup', keys, targets);
    }

    keydown(keys, targets) {
        return this._pushKeyEvent('keydown', keys, targets);
    }

    _pushKeyEvent(eventName, keys, targets) {
        var keysArray = [];
        for (let i=0; i<keys.length; i++)
            keysArray.push(keys.charAt(i));
        
        var opts = [];
        keysArray.forEach(key => {
            opts.push({
                options: {
                    key: key
                },
                targets: targets
            });
        });

        this._pushEvent('dom', eventName, opts);

        return this;
    }

    _pushEvent(eventType, eventName, eventOptions) {
        if (!this[eventType])
            this[eventType] = {};
        if (!this[eventType][eventName])
            this[eventType][eventName] = [];

        eventOptions.forEach(option => {
            this[eventType][eventName].push(option);
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
     *                      options: {
     *                          key: 'a'
     *                      }
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
        this._waiting = new Map;
        this._domActions = new Map;
        this._gameActions = new Map;

        _.each(Controls.DEFAULT_CONTROLS, (actionObject, controlName) => {
            this.set(controlName, custom[controlName] || actionObject);
        });

        this._setupListeners();
    }

    _setupListeners() {
        this._domActions.forEach((actionSet, evtName) => {
            window.addEventListener(evtName, e => {
                actionSet.forEach(action => {
                    // if the event should happen in another target
                    if (action.targets.size > 0 && !action.targets.has(e.target))
                        return;
                    
                    var matchedOpts = _.every(action.options, (value, name) => {
                        return e[name] === value;
                    });

                    // if the event fired matches the specified event options for the control
                    if (!matchedOpts)
                        return;

                    this._waiting.set(action.controlName, e);
                });
            });
        });
    }

    /**
     * Remaps a control to a new action.
     * @param {string} controlName 
     * @param {string} actionString 
     */
    set(controlName, actionObject) {
        _.each(actionObject.dom, (actions, actionName) => {
            actions.forEach(action => {
                if (!this._domActions.has(actionName))
                    this._domActions.set(actionName, new Set);
                this._domActions.get(actionName).add({
                    options: action.options,
                    targets: new Set(action.targets),
                    controlName: controlName
                });
            });
        });

        _.each(actionObject.game, (actions, actionName) => {
            actions.forEach(action => {
                if (!this._gameActions.has(actionName))
                    this._gameActions.set(actionName, new Set);
                this._gameActions.get(actionName).add({
                    options: action.options,
                    targets: new Set(action.targets),
                    controlName: controlName
                });
            });
        });
    }

    update(deltaTime) {
        this._waiting.forEach((evt, controlName) => {
            this._eventEmitter.emit(controlName, deltaTime, evt);
        });
        this._waiting.clear();
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
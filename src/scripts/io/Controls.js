import _ from 'underscore';
import {DisplayObject} from 'pixi.js';
import * as util from '../util/util';
import globals from '../resources/globals';

var _RegexTests = {
    IDENTIFIER_TEST: /\S+/, 
    SEPARATOR_TEST: /[\s,]+/,
    DOM_QUERY_TEST: /\[(.*)\]/,
    PIXI_QUERY_TEST: /\{(.*)\}/
};

/**
 * Processes action selectors and binds/unbinds its events
 */
class _ActionListener {
    constructor(querySelector, gameSelector, actions, callback) {
        this._querySelector = querySelector;
        this._gameSelector = gameSelector;
        this._actions = actions;
        this._callback = callback;
        
        this._domTargets = util.operation.isNullOrEmpty(querySelector) ?
            [window]
            : window.document.querySelectorAll(querySelector);
        this._gameTargets = [];
        if (!util.operation.isNullOrEmpty(gameSelector)) {
            gameSelector.split(_RegexTests.SEPARATOR_TEST).forEach(name => {
                var child = globals.pixiApp.stage.getChildByName(name);
                if (child != null)
                    this._gameTargets.push(child);
            });
        }

        this.subscribe();
    }

    subscribe() {
        this._actions.forEach(action => {
            action = action.toLowerCase();
            if (_ActionListener.VALID_PIXI_EVENTS.has(action)) {
                this._gameTargets.forEach(target => {
                    target.on(action, this._callback);
                });
            }
            else if (_ActionListener.VALID_DOM_EVENTS.has(action)) {
                this._domTargets.forEach(target => {
                    target.addEventListener(action, this._callback);
                });
            }
            else { // action is a specific key to be pressed
                // TODO: Make a better keydown keyup system which tracks past keys too
                window.addEventListener('keydown', (e) => {
                    if (e.key.toLowerCase() == action)
                        this._callback(e);
                });

                window.addEventListener('keyup', (e) => {
                    if (e.key.toLowerCase() == action)
                        this._callback(e);
                });
            }
        });
    }

    unsubscribe() {
        this._actions.forEach(action => {
            if (_ActionListener.VALID_PIXI_EVENTS.has(action)) {
                this._gameTargets.forEach(target => {
                    target.off(action, this._callback.bind(this._callback));
                });
            }
            else if (_ActionListener.VALID_DOM_EVENTS.has(action)) {
                this._domTargets.forEach(target => {
                    target.removeEventListener(action, this._callback.bind(this._callback));
                });
            }
        });
    }

    static getValidEvents(obj) {
        var r = new Set;
        for (let prop in obj) {
            if (prop.substring(0, 2) === 'on' && 
                (obj[prop] == null || typeof obj[prop] == 'function'))
                r.add(prop);
        }
        return r;
    }
}

_ActionListener.VALID_DOM_EVENTS = _ActionListener.getValidEvents(document);

_ActionListener.VALID_PIXI_EVENTS = _ActionListener.getValidEvents(DisplayObject.prototype);

/**
 * Provides an abstaction to commands given to the window through
 * events based on command triggers.
 */
class Controls {
    /**
     * Constructs the controls object
     * @param {Object} custom command customizations
     * All custom values must come in the form of: '[qs?] {gs?} ACTION1 ACTION2 ...', 
     * where 'qs' is a CSS-query selector for DOM elements (for events detected in the DOM)
     * and 'gs' is a PIXI name selector for in-game objects
     * @example
     * var custom = {
     *      // maps DO_SOMETHING command to 'pointerover' action onto the player
     *      DO_SOMETHING: '{player} pointerover',
     *      
     *      // maps DO_ANOTHER_THING command to 'a' and 'd' keys on #myDiv DOM element
     *      DO_ANOTHER_THING: '[#myDiv] a d',
     * 
     *      // maps DO_YET_ANOTHER_THING command to 'k' and 'l' keys on the browser window
     *      DO_YET_ANOTHER_THING: 'k l'
     * }
     * var c = Controls(custom);
     */
    constructor(gameEventEmitter = globals.events, custom = {}) {
        this._eventEmitter = gameEventEmitter;
        // Maps the value to its key. Eg: 'CAMERA_UP': 'A'
        this._controlMappings = new Map;
        _.each(Controls.DEFAULT_CONTROLS, (actionString, controlName) => {
            this.set(controlName, custom[controlName] || actionString);
        });
    }

    /**
     * Finds the action mapped to the control
     * @param {string} controlName 
     */
    getAction(controlName) {
        return this._controlMappings.get(controlName);
    }

    /**
     * Remaps a control to a new action.
     * @param {string} controlName 
     * @param {string} action 
     */
    set(controlName, actionString) {
        var querySelector = util.operation.get(actionString.match(_RegexTests.DOM_QUERY_TEST), 0, ''),
            gameSelector = util.operation.get(actionString.match(_RegexTests.PIXI_QUERY_TEST), 0, ''),
            actions = actionString.replace(_RegexTests.DOM_QUERY_TEST, '')
                .replace(_RegexTests.PIXI_QUERY_TEST, '')
                .split(_RegexTests.SEPARATOR_TEST);

        var listener = new _ActionListener(querySelector, gameSelector, actions, e => {
            e.name = controlName;
            this._eventEmitter.emit(controlName, e);
        });
        this._controlMappings.set(controlName, listener);
    }
}

/**
 * Maps control names to their default actions
 */
Controls.DEFAULT_CONTROLS = {
    CAMERA_LEFT:     'a',
    CAMERA_RIGHT:    'd',
    CAMERA_UP:       'w',
    CAMERA_DOWN:     's',
    CAMERA_ZOOM_IN:  '[',
    CAMERA_ZOOM_OUT: ']'
};

export default Controls;
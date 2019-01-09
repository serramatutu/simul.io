import EventEmitter from 'events';
import Initializer from './Initializer';
import * as PIXI from 'pixi.js';

var globals = {};

window.onload = () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    globals.camera = null;
    globals.console = window.console;
    globals.controls = null; // TODO = Temporary
    globals.events = new EventEmitter;
    globals.pixiApp = null;
    globals.resourceInitializer = Initializer;
    globals.world = null;

    // load stuff
    globals.resourceInitializer.loadAssets(globals.onload);
};

export default globals;
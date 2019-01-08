import Initializer from './Initializer';

var globals = {};

window.onload = () => {
    globals.camera = null;
    globals.console = window.console;
    globals.controls = null; // TODO = Temporary
    globals.pixiApp = null;
    globals.resourceInitializer = Initializer;
    globals.world = null;

    // load stuff
    globals.resourceInitializer.loadAssets(globals.onload);
};

export default globals;
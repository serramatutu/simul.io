import ControlsProfile from '../io/ControlsProfile';
import Initializer from './Initializer';

var globals = {
    camera: null,
    controlsProfile: new ControlsProfile, // TODO: Temporary
    pixiApp: null,
    resourceInitializer: Initializer,
    world: null
};

export default globals;
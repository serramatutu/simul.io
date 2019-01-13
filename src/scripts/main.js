import * as PIXI from 'pixi.js';
import globals from './resources/globals';
import Camera from './graphic/Camera';
import CameraController from './io/CameraController';
import World from './world/World';
import Controls from './io/Controls';

function main() {
    globals.onload = () => {
        var container = document.getElementById('canvas-container');
        var app = new PIXI.Application(container.clientWidth, container.clientHeight, {
            backgroundColor: 0xFFFFFF
        });
        container.appendChild(app.view);
        globals.pixiApp = app;

        var world = new World(100, 100);
        globals.world = world;
        globals.controls = new Controls;
        globals.camera = new Camera({
            worldContainer: world.container, 
            screenWidth: app.screen.width, 
            screenHeight: app.screen.height
        });
        var cc = new CameraController(globals.camera);
        globals.console.log(cc);

        app.stage.addChild(globals.camera);
        app.ticker.add(globals.controls.update.bind(globals.controls));
        app.ticker.add(world.update.bind(world));

        var logger = document.getElementById('logger');
        var avg = 0;
        var qty=0;
        app.ticker.add(deltaTime => {
            var fps = 60/deltaTime;
            qty++;
            avg += (fps - avg)/qty;
            logger.innerText = 'FPS: ' + Math.round(avg);
        });
    };
}

export default main;
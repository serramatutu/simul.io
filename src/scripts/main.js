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

        var world = new World(100, 60);
        globals.world = world;
        app.stage.addChild(world.container);
        app.ticker.add(world.update.bind(world));
        globals.controls = new Controls;
        globals.camera = new Camera(world.container);
        var cc = new CameraController(globals.camera);
        app.ticker.add(cc.update.bind(cc));
    };
}

export default main;
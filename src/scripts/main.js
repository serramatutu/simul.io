import * as PIXI from 'pixi.js';
import globals from './resources/globals';
import Camera from './graphic/Camera';
import CameraController from './io/CameraController';
import World from './world/World';

function main() {
    window.onload = () => {
        globals.resourceInitializer.loadAssets(() => {
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
            globals.camera = new Camera(world.container);
            var cc = new CameraController(document.body);
            app.ticker.add(cc.update.bind(cc));
        });
    };
}

export default main;
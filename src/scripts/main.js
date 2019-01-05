import * as PIXI from 'pixi.js';
// import {World} from './world/World';

function main() {
    window.onload = () => {
        var container = document.getElementById('canvas-container');
        var app = new PIXI.Application(container.clientWidth, container.clientHeight, {
            backgroundColor: 0xFFFFFF
        });
        container.appendChild(app.view);

    };
}

export default main;
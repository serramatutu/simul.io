import * as biome from './world/Biome';

function main() {
    window.onload = () => {
        var logger = document.body.getElementById('logger');
        var b = new biome.BiomeGenerator('tundra', 0);
        logger.innerHTML += b.priority;
    };
}

export default main;
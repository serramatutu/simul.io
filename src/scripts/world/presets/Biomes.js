import { InteractionProfile } from '../Interaction';
import { BiomeGenerator } from '../Biome';
import Tile from '../Tile';
import * as util from '../../util/util';
import tuning from '../../../tuning';

var DefaultEcoFactors = {
    export: function(options) {
        var exp = {};
        for (var prop in this) {
            if (!this.hasOwnProperty(prop) || typeof this[prop] === 'function')
                continue;
            
            exp[prop] = this[prop];
            if (!options[prop].defaultValue) exp[prop][0] = options[prop].defaultValue;
            if (!options[prop].dependencies) exp[prop][1] = options[prop].dependencies;
            if (!options[prop].calculator) exp[prop][2] = options[prop].calculator;
        }

        return exp;
    },

    'SUNLIGHT': {
        calculator: (deltaTime, vars) => {
            vars.cycle = (vars.cycle + (deltaTime / tuning.DAY_LENGTH)) % 1;

            if (vars.cycle < 0.2)
                return util.transition.easeInOutQuad(vars.cycle * 5);
            if (vars.cycle >= 0.1 && vars.cycle < 0.5)
                return 1;
            if (vars.cycle >= 0.5 && vars.cycle < 0.7)
                return 1 - util.transition.easeInOutQuad((vars.cycle - 0.5) * 5);
            
            return 0;
        }
    }
};

export { DefaultEcoFactors };

class DesertBiome extends BiomeGenerator {
    initialize(width, height) {
        var matrix = new Array(width);
        for (let i=0; i<width; i++) {
            matrix[i] = new Array(height);
            for (let j=0; j < height; j++) {
                matrix[i][j] = new Tile(i, j, this.interactionProfile, {
                    'SUNLIGHT': { // very hot indeed
                        min: 0 + Math.random() * 0.2,
                        max: 1 - Math.random() * 0.2,
                        value: 0,
                        cycle: 0
                    }
                }, 'desert_tile.png');
            }
        }

        return matrix;
    }
}
DesertBiome.priority = 1;
DesertBiome.interactionProfile = new InteractionProfile(
    'DesertBiome',
    {
        'SUNLIGHT': DefaultEcoFactors.SUNLIGHT
    }
);

export {DesertBiome};
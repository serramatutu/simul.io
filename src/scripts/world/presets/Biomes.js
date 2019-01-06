import { BiomeGenerator } from '../Biome';

class DesertBiome extends BiomeGenerator {
    initialize(width, height) {
        
    }
}
DesertBiome.priority = 1;
DesertBiome.interactionProfile = new InteractionProfile(
    'DesertBiome',
    {
        'SUNLIGHT': 20
    }
);

export {DesertBiome};
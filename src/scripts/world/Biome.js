/**
 * Used to initialize partial world matrices values according to a biome specification
 */
class BiomeGenerator {
    /**
     * 
     * @param {string} biomeName the biome name
     * @param {number} priority the biomes priority over other biomes
     * @param {InteractionProfile} interactionProfile how ecofactors behave in this biome
     */
    constructor(biomeName, priority, interactionProfile) {
        this._biomeName = biomeName;
        this._priority = priority;
        this._interactionProfile = interactionProfile;
    }

    get name() {
        return this._biomeName;
    }

    get priority() {
        return this._priority;
    }

    get interactionProfile() {
        return this._interactionProfile;
    }

    /**
     * Rescribes a biome initialization strategy based on a matrix of given width and height
     * @param {number} width the biome's width
     * @param {number} height the biome's height
     * @returns {Array} a matrix of width x height containing objects mapping each ecofactor to its default value
     */
    initializationStrategy(width, height) {
        var ret = Array(width);
        for (let i=0; i<width; i++)
        {
            ret[i] = new Array(height);
            for (let j=0; j<height; j++)
                ret[i][j] = {};
        }

        return ret;
    }
}

export { BiomeGenerator };


/**
 * Used to initialize partial world matrices values according to a biome specification.
 * This should not be instanced directly without derivation
 */
class BiomeGenerator {
    get name() {
        return this.constructor.name;
    }

    get priority() {
        return this.constructor.priority;
    }

    get interactionProfile() {
        return this.constructor.interactionProfile;
    }

    /**
     * Rescribes a biome initialization strategy based on a matrix of given width and height
     * @param {number} width the biome's width
     * @param {number} height the biome's height
     * @returns {Array} a matrix of width x height containing objects mapping each ecofactor to its min and max malue
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

BiomeGenerator.priority = 0;
BiomeGenerator.initializationStrategy = null;

export { BiomeGenerator };
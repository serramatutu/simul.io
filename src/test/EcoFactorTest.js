const buckets = require('buckets-js');
const assert = require('assert');

const util = require('../scripts/util/data-structure-conversion.js');
const { EcoFactorDependencyManager } = require('../scripts/world/EcoFactor.js');

describe('EcoFactorDependencyManager', () => {
    describe('#_generateGraph()', () => {
        it('should resolve unresolved dependencies', () => {
            var t = new EcoFactorDependencyManager();
            t.addEcofactor('SUNLIGHT', util.arrayToSet(['HUMIDITY']));
            t.addEcofactor('HUMIDITY', new buckets.Set());

            var graph = t._generateGraph();
            assert.equal(true, graph.get('HUMIDITY').out.contains('SUNLIGHT'));
        });
    });
})
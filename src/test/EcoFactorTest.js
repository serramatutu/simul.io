import buckets from 'buckets-js';
import assert from 'assert';
import * as util from '../scripts/util/data-structure-conversion.js';
import { EcoFactorDependencyManager } from '../scripts/world/EcoFactor.js';

describe('EcoFactorDependencyManager', () => {
    describe('#_generateGraph()', () => {
        it('should resolve unresolved dependencies', () => {
            var m = new EcoFactorDependencyManager();
            m.addEcofactor('SUNLIGHT', util.arrayToSet(['HUMIDITY']));
            m.addEcofactor('HUMIDITY', new buckets.Set());

            assert.equal(true, m.get('HUMIDITY').dependants.contains('SUNLIGHT'));
            assert.equal(true, m.get('SUNLIGHT').dependencies.contains('HUMIDITY'));
        });
    });
})
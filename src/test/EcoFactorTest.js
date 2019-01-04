import assert from 'assert';
import { EcoFactorInteractionProfile } from '../scripts/world/EcoFactorInteractionProfile.js';

describe('EcoFactorInteractionProfile', () => {
    describe('#_generateGraph()', () => {
        var profile;

        beforeEach(() => {
            profile = new EcoFactorInteractionProfile();
            profile.addEcofactor('SUNLIGHT', 20, ['HUMIDITY']);
            profile.addEcofactor('HUMIDITY', 40, []);
        })

        it('should resolve unresolved dependencies', () => {
            assert.equal(true, profile.get('HUMIDITY').dependants.contains('SUNLIGHT'));
            assert.equal(true, profile.get('SUNLIGHT').dependencies.contains('HUMIDITY'));
        });

        it('should correctly update all ecofactors', () => {
            var updated = profile.update({
                "SUNLIGHT": 25,
                "HUMIDITY": 20
            });
            assert.equal(25, updated.get("SUNLIGHT"));
            assert.equal(20, updated.get("HUMIDITY"));
        });
    });
})
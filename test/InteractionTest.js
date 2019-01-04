import assert from 'assert';
import { convert } from '../src/scripts/util/util';
import { InteractionProfile, CompositeInteractionProfile } from '../src/scripts/world/Interaction';

describe('InteractionProfile', () => {
    describe('graph operations', () => {
        var profile;

        beforeEach(() => {
            profile = new InteractionProfile();
            profile.add('SUNLIGHT', 20, convert.arrayToSet(['HUMIDITY']));
            profile.add('HUMIDITY', 40, convert.arrayToSet([]));
        });

        it('should resolve unresolved dependencies', () => {
            assert.strictEqual(true, profile.get('HUMIDITY').dependants.contains('SUNLIGHT'));
            assert.strictEqual(true, profile.get('SUNLIGHT').dependencies.contains('HUMIDITY'));
        });

        it('should create an unresolved dependency if a required value is removed from the system', () => {
            assert.strictEqual(true, profile.isResolved());
            profile.remove('HUMIDITY');
            assert.strictEqual(false, profile.isResolved());
        });

        it('should correctly update all variables', () => {
            var updated = profile.update(convert.objectToDictionary({
                "SUNLIGHT": 25,
                "HUMIDITY": 20
            }));
            assert.strictEqual(20, updated.get("SUNLIGHT"));
            assert.strictEqual(40, updated.get("HUMIDITY"));
        });
    });
});

describe('CompositeInteractionProfile', () => {
    var profile, p1, p2;
    beforeEach(() => {
        profile = new CompositeInteractionProfile();
        
        p1 = new InteractionProfile('a');
        p1.add('SUNLIGHT', 20);
        p2 = new InteractionProfile('b');
        p2.add('SUNLIGHT', 40);

        profile.addProfile(p1, 1);
        profile.addProfile(p2, 2);
    });

    it('should add the weights of two identical profiles', () => {
        profile.addProfile(p1, 1);
        assert.strictEqual(profile.profileWeights.get(p1.name), 2);
    });

    it('should calculate values correctly', () => {
        var updated = profile.update(convert.objectToDictionary({
            "SUNLIGHT": 20
        }));

        assert.strictEqual(updated.get("SUNLIGHT"), (20*1 + 40*2)/3);
    })
});
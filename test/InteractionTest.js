import assert from 'assert';
import { convert } from '../src/scripts/util/util';
import { InteractionProfile, CompositeInteractionProfile } from '../src/scripts/world/Interaction';

describe('InteractionProfile', () => {
    describe('graph operations', () => {
        var profile;

        beforeEach(() => {
            profile = new InteractionProfile('the profile', {
                'SUNLIGHT': {
                    min: 0, max: 1,
                    dependencies: ['HUMIDITY']
                },
                'HUMIDITY': {
                    min: 0, max: 1
                }
            });
            // profile = new InteractionProfile();
            // profile.add('SUNLIGHT', 20, convert.arrayToSet(['HUMIDITY']));
            // profile.add('HUMIDITY', 40, convert.arrayToSet([]));
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
            var updated = profile.update(0, convert.objectToDictionary({
                'SUNLIGHT': {
                    value: 0.2
                },
                'HUMIDITY': {
                    value: 0.1
                }
            }));
            assert.strictEqual(0.2, updated.get('SUNLIGHT'));
            assert.strictEqual(0.1, updated.get('HUMIDITY'));
        });
    });
});

describe('CompositeInteractionProfile', () => {
    var profile, p1, p2;
    beforeEach(() => {
        profile = new CompositeInteractionProfile();
        
        p1 = new InteractionProfile('a');
        p1.add('SUNLIGHT', {
            calculator: () => { return 0; }
        });
        p2 = new InteractionProfile('b');
        p2.add('SUNLIGHT', {
            calculator: () => { return 1; }
        });

        profile.addProfile(p1, 1);
        profile.addProfile(p2, 2);
    });

    it('should add the weights of two identical profiles', () => {
        profile.addProfile(p1, 1);
        assert.strictEqual(profile.profileWeights.get(p1.name), 2);
    });

    it('should calculate values correctly', () => {
        var updated = profile.update(0, convert.objectToDictionary({
            'SUNLIGHT': {
                value: 0
            }
        }));

        assert.strictEqual(updated.get('SUNLIGHT'), 2/3);
    });
});
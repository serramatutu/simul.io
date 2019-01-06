import _ from 'underscore';
import buckets from 'buckets-js';
import * as util from '../util/util';

/**
 * A directed graph to manage complex variable dependencies and their values
 */
class InteractionProfile {
    /**
     * 
     * @param {string} [name] this profile's name
     * @param {Array} [variables] this profile's variable scheme.
     * @example
     * var i = new InteactionProfile('the profile', {
     *      'A_VARIABLE': [
     *          ['ANOTHER_VARIABLE'], // its dependencies
     *          (deltaTime, value, deps) => { // its interpolation calculator
     *              return value + deps['ANOTHER_VARIABLE']
     *          }
     *      ],
     *      'ANOTHER_VARIABLE': 25
     * });
     */
    constructor(name = null, variables = {}) {
        this._name = util.operation.generateName(this, name);
        this._unresolvedDeps = new buckets.MultiDictionary();
        this._variables = new buckets.Dictionary();
        
        _.each(variables, (value, key) => {
            this.add(key, value);
        });
    }

    get name() {
        return this._name;
    }

    add(name, options = {}) {
        var dependencies = !options.dependencies ?
                new buckets.Set()
                : util.convert.arrayToSet(options.dependencies),
            calculator = options.calculator || InteractionProfile.defaultCalculator;

        
        dependencies.forEach(dep => {
            if (this._variables.containsKey(dep))
                this._variables.get(dep).dependants.add(name);
            else
                this._unresolvedDeps.set(dep, name);
        });

        this._variables.set(name, {
            calculator: calculator,
            dependencies: dependencies, // dependencies
            dependants: util.convert.arrayToSet(this._unresolvedDeps.get(name)) // nodes which depend on this node
        });

        this._unresolvedDeps.remove(name);
    }

    remove(name) {
        this._variables.get(name).dependants.forEach(dependant => {
            // if any other variable depends on the removed, we add an unresolved dependency to it
            this._unresolvedDeps.set(name, dependant);
        });

        this._variables.get(name).dependencies.forEach(dependency => {
            // removes all unresolved dependencies from it
            this._unresolvedDeps.remove(dependency, name);
        });

        this._variables.remove(name);
    }

    get(name) {
        return this._variables.get(name);
    }

    isResolved(dependency) {
        if (!dependency)
            return this._unresolvedDeps.isEmpty();

        return this._unresolvedDeps.containsKey(dependency);
    }

    update(deltaTime, valueDict) {
        var newValues = new buckets.Dictionary();
        valueDict.forEach(name => {
            var variableObj = this._variables.get(name);
            var interpolation = variableObj.calculator.bind(variableObj.calculator)(deltaTime, 
                valueDict.get(name), 
                valueDict);
            newValues.set(name, interpolation);
        });

        return newValues;
    }
}

InteractionProfile.defaultCalculator = function(deltaTime, currentInterpolation) {
    return currentInterpolation;
};

export { InteractionProfile };

/**
 * Creates a resulting interaction profile based on the mean of multiple other simple
 * interaction profiles
 */
class CompositeInteractionProfile {
    constructor(name = null) {
        this._name = util.operation.generateName(this, name);
        this._profiles = new buckets.Set((p) => {
            return p.name;
        });
        this._profileWeights = new buckets.Dictionary();
        this._totalWeight = 0;
    }

    get name() {
        return this._name;
    }

    get profileWeights() {
        return this._profileWeights;
    }

    addProfile(profile, weight = 1) {
        let currentWeight = this._profileWeights.get(profile.name) || 0;
        this._profiles.add(profile);
        this._profileWeights.set(profile.name, weight + currentWeight);
        this._totalWeight += weight;
    }

    removeProfile(profile) {
        this._totalWeight -= this._profileWeights.get(profile.name);
        this._profileWeights.remove(profile.name);
        this._profiles.remove(profile);
    }

    update(deltaTime, valueDict) {
        var newValues = new buckets.Dictionary();
        this._profiles.forEach(profile => {
            var profValues = profile.update(deltaTime, valueDict);
            var weight = this._profileWeights.get(profile.name);

            profValues.forEach((name, value) => {
                var currentValue = newValues.get(name) || 0;
                newValues.set(name, currentValue + weight*value);
            });
        });

        var ret = new buckets.Dictionary();
        newValues.forEach((name, value) => {
            ret.set(name, value/this._totalWeight);
        });

        return ret;
    }
}

export { CompositeInteractionProfile };
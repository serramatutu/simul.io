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
     *          20, // its default value
     *          ['ANOTHER_VARIABLE'], // its dependencies
     *          (value, defaultValue, deps) => {
     *              return value + deps['ANOTHER_VARIABLE']
     *          }
     *      ],
     *      'ANOTHER_VARIABLE': 25
     * });
     */
    constructor(name = null, variables = []) {
        this._name = util.operation.generateName(this, name);
        this._unresolvedDeps = new buckets.MultiDictionary();
        this._variables = new buckets.Dictionary();
        this._parseVariableScheme(variables);
    }

    _parseVariableScheme(scheme) {
        _.each(scheme, (value, name) => {
            var defaultValue = 0, 
                dependencies = new buckets.Set(), 
                calculator = InteractionProfile.defaultCalculator;
            if (typeof value === 'number')
                defaultValue = value;
            else if (_.isArray(value)) {
                value.forEach(opt => {
                    if (typeof opt === 'number')
                        defaultValue = opt;
                    else if (_.isArray(opt))
                        dependencies = util.convert.arrayToSet(opt);
                    else if (typeof opt === 'function')
                        calculator = opt;
                });
            }

            this.add(name, defaultValue, dependencies, calculator);
        });
    }

    get name() {
        return this._name;
    }

    add(name, defaultValue = 0, dependencies = new buckets.Set(), calculator = InteractionProfile.defaultCalculator) {
        
        dependencies.forEach(dep => {
            if (this._variables.containsKey(dep))
                this._variables.get(dep).dependants.add(name);
            else
                this._unresolvedDeps.set(dep, name);
        });

        this._variables.set(name, {
            defaultValue: defaultValue,
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

    update(valueDict) {
        var newValues = new buckets.Dictionary();
        valueDict.forEach(name => {
            var variableObj = this._variables.get(name);
            newValues.set(name, 
                variableObj.calculator(valueDict.get(name), // invokes the calculator over the values
                    variableObj.defaultValue, 
                    valueDict));
        });

        return newValues;
    }
}

InteractionProfile.defaultCalculator = (value, defaultValue) => {
    return defaultValue;
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

    update(valueDict) {
        var newValues = new buckets.Dictionary();
        this._profiles.forEach(profile => {
            var profValues = profile.update(valueDict);
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
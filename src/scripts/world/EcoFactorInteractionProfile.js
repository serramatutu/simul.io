import buckets from 'buckets-js';
import { convert } from '../util/util';

/**
 * A directed graph to manage EcoFactor dependencies and values
 */
class EcoFactorInteractionProfile {
    constructor() {
        this._ecofactors = new buckets.Dictionary();
        this._unresolvedDeps = new buckets.MultiDictionary();
    }

    addEcofactor(ecofactor, 
                 defaultValue = 0, 
                 dependencies = [], 
                 calculator = EcoFactorInteractionProfile.defaultCalculator) {
        dependencies = convert.arrayToSet(dependencies);
        
        dependencies.forEach(dep => {
            if (this._ecofactors.containsKey(dep))
                this._ecofactors.get(dep).dependants.add(ecofactor);
            else
                this._unresolvedDeps.set(dep, ecofactor);
        });

        this._ecofactors.set(ecofactor, {
            defaultValue: defaultValue,
            calculator: calculator,
            dependencies: dependencies, // dependencies
            dependants: convert.arrayToSet(this._unresolvedDeps.get(ecofactor)) // nodes which depend on this node
        });

        this._unresolvedDeps.remove(ecofactor);
    }

    removeEcofactor(ecofactor) {
        this._ecofactors.get(ecofactor).dependants.forEach(dependant => {
            // if any other factor depends on the removed, we add an unresolved dependency to it
            this._unresolvedDeps.set(ecofactor, dependant);
        });

        this._ecofactors.get(ecofactor).dependencies.forEach(dependency => {
            // removes all unresolved dependencies from it
            this._unresolvedDeps.remove(dependency, ecofactor);
        });

        this._ecofactors.remove(ecofactor);
    }

    get(ecofactor) {
        return this._ecofactors.get(ecofactor);
    }

    isResolved(dependency) {
        if (!dependency)
            return this._unresolvedDeps.isEmpty();

        return this._unresolvedDeps.containsKey(dependency);
    }

    update(valueDict) {
        valueDict = convert.objectToDictionary(valueDict);
        var newValues = new buckets.Dictionary();
        valueDict.forEach((ecofactor, value) => {
            var ecofactorObj = this._ecofactors.get(ecofactor)
            newValues.set(ecofactor, 
                ecofactorObj.calculator(valueDict.get(ecofactor), // invokes the calculator over the values
                                        ecofactorObj.defaultValue, 
                                        valueDict));
        });

        return newValues;
    }
}

EcoFactorInteractionProfile.defaultCalculator = (value, defaultValue, dependencyValues) => {
    return value;
}

export { EcoFactorInteractionProfile };
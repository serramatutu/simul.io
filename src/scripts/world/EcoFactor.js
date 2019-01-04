import buckets from 'buckets-js';
import * as util from '../util/data-structure-conversion';

/**
 * A directed graph to manage EcoFactor dependencies
 */
class EcoFactorDependencyManager {
    constructor() {
        this._ecofactors = new buckets.Dictionary();
        this._unresolvedDeps = new buckets.MultiDictionary();
    }

    addEcofactor(ecofactor, dependencies) {
        dependencies.forEach(dep => {
            if (this._ecofactors.containsKey(dep))
                this._ecofactors.get(dep).out.add(ecofactor);
            else
                this._unresolvedDeps.set(dep, ecofactor);
        });

        this._ecofactors.set(ecofactor, {
            dependencies: dependencies, // dependencies
            dependants: util.arrayToSet(this._unresolvedDeps.get(ecofactor)) // nodes which depend on this node
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
}

export { EcoFactorDependencyManager };

class EcoFactor {
    constructor(defaultValue, dependencies = new buckets.Set(), calculator = EcoFactor.defaultCalculator) {
        this._defaultValue = defaultValue;
        this._cachedValue = defaultValue;
        this._dependencies = dependencies;
        this._calculator = calculator;
    }

    recalculateValue(ecofactors) {
        this._cachedValue = this._calculator(this._defaultValue, ecofactors);
    }

    get value() {
        return this._cachedValue;
    }

    get dependencies() {
        return this._dependencies;
    }

    get defaultValue() {
        return this._defaultValue;
    }
}

EcoFactor.defaultCalculator = (defaultValue, ecofactors) => {
    return defaultValue;
}

export { EcoFactor };
/**
 * A directed graph to encapsulate EcoFactor dependencies for
 * determining the optimal calculation order
 */
class EcoFactorDependencyManager {
    constructor() {
        this._ecofactors = new buckets.Dictionary();
    }

    addEcofactor(name, dependencies) {
        this._ecofactors.set(name, dependencies);
    }

    removeEcofactor(name) {
        this._ecofactors.remove(name);
    }

    /**
     * Generates a graph with precalculated out edges 
     * based on the ecofactors set
     */
    _generateGraph() {
        var unresolvedDeps = new buckets.MultiDictionary();

        this._ecofactors.forEach((ecofactor, deps) => {
            // sets other nodes' out edges as the current node based on its dependencies
            deps.forEach(dependecy => {
                // if the dependency has already been added to the graph,
                // the current node is added as an out node at the target
                if (graph.containsKey(dependecy))
                    graph.get(dependecy).out.add(ecofactor);
                else
                    unresolvedDeps.set(dependecy, ecofactor);
            });

            out = new buckets.Set(); // the current node's out edges
            // resolves this node's unresolved out dependencies now that it's being
            // added to the graph
            unresolvedDeps.get(ecofactor).forEach(val => {
                out.add(val);
            });

            this.graph.set(ecofactor, {
                in: deps,
                out: out 
            });
        });
            
        return graph;
    }

    /**
     * Performs a topological sort using Kahn's algorithm on the graph for determining the optimal
     * calculation order based on their interdependencies.
     * @returns {buckets.Queue} a Queue with ecofactor names in calculation order
     */
    generateCalculationQueue() {
        graph = this._generateGraph();
        var initialSet = new buckets.Queue(); // all nodes with no incoming edge (no dependency)
        var remainingNodes = new buckets.Set(); // nodes which haven't been added to the queue yet
        graph.keys().forEach(key => { // populates remainingNodes set
            remainingNodes.add(key);
        })

        graph.forEach((name, edges) => {
            if (edges.in.isEmpty())
                initialSet.add(name);
        });

        var queue = new buckets.Queue(); // the calculation queue

        while (!initialSet.isEmpty()) {
            let currentNode = initialSet.dequeue();
            queue.enqueue(currentNode);
            remainingNodes.remove(currentNode);
            
            graph.get(currentNode).out.forEach(outNode => {
                graph.get(currentNode).in.remove(outNode);
                graph.get(outNode).out.remove(currentNode);

                if (outNode.in.isEmpty()) {
                    queue.enqueue(outNode);
                    remainingNodes.remove(currentNode);
                }
            });
        }

        if (!remainingNodes.isEmpty()) { // If the graph is cyclic
            // the order of calculation of the cycle is random. This shouldn't affect
            // ecossystems in a macro-scale. If two cycles overlap, the algorithm
            // chooses the most significant node in terms of outgoing edges
            // to go first.
            var pq = buckets.PriorityQueue((a, b) => {
                // if more nodes depend on "a" than on they do on "b", "a" will be chosen to go first
                return a.in.size() - b.in.size(); 
            });
            
            remainingNodes.forEach(node => {
                pq.enqueue(node);
            });

            do {
                // enqueues them according to order
                queue.enqueue(pq.dequeue());
            } while (!pq.isEmpty())
        }

        return queue;
    }
}

module.exports = EcoFactorDependencyManager;

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

module.exports = EcoFactor;
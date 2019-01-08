/**
 * Stores a reference to a value through a lazy-evaluated function. This is very
 * useful for passing values (not objects) by reference.
 * 
 * @example
 * var o = { foo: 'bar' }
 * var ref = Reference.fromObject(o, 'foo')
 * 
 * console.log(ref.valueOf()) // 'bar'
 * o.foo = 'baz'
 * console.log(ref.valueOf()) // baz
 */
class Reference {
    constructor(fn) {
        if (typeof fn !== 'function')
            throw new Error('fn has to be a function');
        this._fn = fn;
    }

    /**
     * Determines the reference value.
     */
    valueOf() {
        return this._fn();
    }

    static fromObject(obj, propertyName) {
        return new Reference(() => {
            return obj[propertyName];
        });
    }
}

export default Reference;
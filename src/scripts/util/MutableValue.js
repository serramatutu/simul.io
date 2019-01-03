import buckets from 'buckets-js';

class MutableValue {
    constructor(defaultValue) {
        if (typeof defaultValue !== 'number')
            throw new Error('MutableValue must be a number');

        this._defaultValue = defaultValue;
    }
}

export default MutableValue;
import assert from 'assert';
import * as util from '../scripts/util/util';

describe('util library', () => {
    describe('map', () => {
        it('should map all of the elements in the array correctly', () =>{
            var a = [1, 2, 3, 4, 5];
            var b = util.operation.map(a, (val) => {
                return val + 1;
            });
            assert.deepEqual(b, [2, 3, 4, 5, 6]);
        });
    });
});
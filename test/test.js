import assert from 'assert'

describe('Tests for ensuring that Javascript Array works', function() {
    describe('indexOf', function() {
        it('should return -1 when the value is not present', function() {
            let result = [1, 2, 3].indexOf(4)
            assert.equal(result, -1)
        })
        it('should return 0 for first existing element', function() {
            let result = [1, 2, 3].indexOf(1)
            assert.equal(result, 0)
        })
    })
})